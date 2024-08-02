/* eslint-disable no-useless-catch */
import CryptoJS from 'crypto-js';
import { IvaConfigurationError, IvaRequestError } from './errors';
import { toErrorWithMessage } from '@/lib/helpers';
import {
  IvaConferenceSessionCreateRoomData,
  IvaParticipant,
  IvaUserCreateData
} from './types';
import ProblemJson from '@/lib/problem-json/ProblemJson';

type IvaRequestOptions = {
  data?: Record<string, any>;
  query?: Record<string, any>;
  method?: string;
};

export class IvaService {
  private async getJWTToken() {
    const appId = process.env.IVA_APP_ID;
    const appSecret = process.env.IVA_APP_SECRET;
    const timestamp = Math.ceil(new Date().getTime() / 1000 - 10); // subtract 1 second to avoid token outdated error

    if (!appId || appId.trim() === '') {
      throw new Error('appId is null or empty');
    }

    if (!appSecret || appSecret.trim() === '') {
      throw new Error('appSecret is null or empty');
    }

    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = { sub: appId, iat: timestamp };

    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));

    const signature = CryptoJS.HmacSHA256(encodedHeader + '.' + encodedPayload, appSecret)
      .toString(CryptoJS.enc.Base64)
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
    const token = `${encodedHeader}.${encodedPayload}.${signature}`;

    return token;
  }

  private getIvaDomainId() {
    const domainId = process.env.IVA_APP_DOMAIN_ID;

    if (!domainId || domainId.trim() === '') {
      throw new Error(
        'Not set IVA_APP_DOMAIN_ID option in .env file not be a null or empty'
      );
    }

    return domainId;
  }

  private makeErrorDetail(ivaError: any) {
    return {
      detail: `${ivaError.message || ivaError.reason}. (${ivaError.type})`
    };
  }

  private async request(path: string, options?: IvaRequestOptions) {
    const token = await this.getJWTToken();
    const url = new URL(`${process.env.IVA_API_URL}${path}`);

    if (options?.query) {
      url.search = new URLSearchParams({ ...options.query }).toString();
    }

    try {
      const response = await fetch(url.toString(), {
        method: options?.method ?? 'GET',
        headers: {
          ...(options?.data && { 'Content-Type': 'application/json' }),
          Authorization: `Bearer ${token}`
        },
        ...(options?.data && { body: JSON.stringify({ ...options.data }) })
      });

      if (!response.ok) {
        throw new IvaRequestError({ detail: await response.text() });
      }

      const status = response.status;

      if (status === 204) return null;

      const contentType = response.headers.get('content-type');

      if (status !== 204 && contentType && contentType.includes('application/json')) {
        const data = await response.json();

        if (data.reason) {
          let error;

          switch (data.reason) {
            case 'INVALID_SUB':
              error = new IvaConfigurationError(this.makeErrorDetail(data));
              break;
            default:
              error = new IvaRequestError(this.makeErrorDetail(data));
              break;
          }

          throw error;
        }

        return data;
      } else {
        throw new IvaRequestError({ detail: 'Iva response is not have json format' });
      }
    } catch (error) {
      if (error instanceof ProblemJson) {
        throw error;
      } else {
        throw new IvaRequestError({ detail: toErrorWithMessage(error).message });
      }
    }
  }

  async getServerStatus() {
    try {
      const baseUrl = process.env.IVA_API_URL;
      const res = await fetch(`${baseUrl}/public/system/info`, { cache: 'no-cache' });
      const data = await res.json();

      return data;
    } catch (error) {
      // Получение переменных окружения для включения в сообщение об ошибке
      const envDetails = {
        IVA_API_URL: process.env.IVA_API_URL,
        IVA_APP_ID: process.env.IVA_APP_ID,
        IVA_APP_SECRET: process.env.IVA_APP_SECRET,
        IVA_APP_DOMAIN_ID: process.env.IVA_APP_DOMAIN_ID
      };

      // Добавление деталей переменных окружения в сообщение об ошибке
      throw new IvaRequestError({
        detail: `${toErrorWithMessage(error).message}`,
        env: envDetails
      });
    }
  }

  async findConferenceTemplates() {
    return await this.request('/integration/conference-templates', {
      query: { domainId: this.getIvaDomainId() }
    });
  }

  async createConference(data: IvaConferenceSessionCreateRoomData) {
    return await this.request('/integration/conference-sessions/create-room', {
      method: 'POST',
      data: { ...data, domainId: this.getIvaDomainId() }
    });
  }

  async closeConference(id: string): Promise<void> {
    await this.request(`/integration/conference-sessions/${id}`, { method: 'DELETE' });
  }

  async updateConference(id: string, data: any) {
    return await this.request(`/integration/conference-sessions/${id}`, {
      method: 'PATCH',
      data
    });
  }

  async findConference(id: string) {
    return await this.request(`/integration/conference-sessions/${id}`);
  }

  async addConferenceParticipants(id: string, participants: IvaParticipant[]) {
    return await this.request(`/integration/conference-sessions/${id}/participants/add`, {
      method: 'POST',
      data: participants
    });
  }

  async findConferenceParticipants(id: string, query: any): Promise<Array<any>> {
    const response = await this.request(
      `/integration/conference-sessions/${id}/participants`,
      {
        query
      }
    );

    return response && response.data && response.data;
  }

  async removeConferenceParticipants(id: string, profileIds: string[]) {
    return await this.request(
      `/integration/conference-sessions/${id}/participants/remove`,
      {
        method: 'POST',
        data: profileIds
      }
    );
  }

  async findUsers(searchString?: string, limit: number = 20, offset: number = 0) {
    return await this.request('/integration/users', {
      query: {
        searchString,
        limit: limit.toString(),
        offset: offset.toString(),
        domainId: this.getIvaDomainId()
      }
    });
  }

  async createUser(data: IvaUserCreateData) {
    return await this.request('/integration/users', {
      method: 'POST',
      data: { ...data, domainId: this.getIvaDomainId() }
    });
  }

  async updateUser(id: string, data: any) {
    return await this.request(`/integration/users/${id}`, {
      method: 'PATCH',
      data
    });
  }

  async blockUser(id: string): Promise<void> {
    return await this.request(`/integration/users/${id}/block`, { method: 'POST' });
  }

  async unblockUser(id: string): Promise<void> {
    return await this.request(`/integration/users/${id}/unblock`, { method: 'POST' });
  }

  async removeUser(id: string): Promise<void> {
    await this.request(`/integration/users/${id}`, { method: 'DELETE' });
  }
}
