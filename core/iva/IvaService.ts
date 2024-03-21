/* eslint-disable no-useless-catch */
import CryptoJS from 'crypto-js';
import { IvaRequestError } from './errors';
import { toErrorWithMessage } from '@/lib/helpers';
import {
  IvaConferenceSessionCreateRoomData,
  IvaParticipant,
  IvaUserCreateData
} from './types';

type IvaRequestOptions = {
  data?: Record<string, any>;
  query?: Record<string, any>;
  method?: string;
};

export class IvaService {
  private async getJWTToken() {
    const appId = process.env.IVA_APP_ID;
    const appSecret = process.env.IVA_APP_SECRET;
    const timestamp = Math.ceil(new Date().getTime() / 1000 - 1); // subtract 1 second to avoid token outdated error

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

    console.log(domainId);

    if (!domainId || domainId.trim() === '') {
      throw new Error(
        'Not set IVA_APP_DOMAIN_ID option in .env file not be a null or empty'
      );
    }

    return domainId;
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
        return await response.text();
      }

      const contentType = response.headers.get('content-type');
      console.log(contentType);

      if (contentType && contentType.includes('application/json')) {
        const data = JSON.parse(await response.text());
        return data;
      } else {
        return;
        // throw new Error('Response is not in JSON format');
      }
    } catch (error) {
      throw error;
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
        IVA_APP_DOMAIN_ID: process.env.IVA_APP_DOMAIN_ID,
      };
  
      // Конвертирование объекта с переменными окружения в строку JSON для добавления в детали ошибки
      const envDetailsStr = JSON.stringify(envDetails, null, 2);
  
      // Добавление деталей переменных окружения в сообщение об ошибке
      throw new IvaRequestError({
        detail: `${toErrorWithMessage(error).message}`
      });
    }
  }
  

  
  

  async findConferenceTemplates() {
    try {
      const templates = await this.request('/integration/conference-templates', {
        query: { domainId: this.getIvaDomainId() }
      });

      return templates;
    } catch (error) {
      throw new IvaRequestError({ detail: toErrorWithMessage(error).message });
    }
  }

  async createConference(data: IvaConferenceSessionCreateRoomData) {
    try {
      const createdRoom = await this.request(
        '/integration/conference-sessions/create-room',
        {
          method: 'POST',
          data: { ...data, domainId: this.getIvaDomainId() }
        }
      );

      return createdRoom;
    } catch (error) {
      throw new IvaRequestError({ detail: toErrorWithMessage(error).message });
    }
  }

  async closeConference(id: string) {
    try {
      await this.request(`/integration/conference-sessions/${id}`, { method: 'DELETE' });
    } catch (error) {
      throw new IvaRequestError({ detail: toErrorWithMessage(error).message });
    }
  }

  async updateConference(id: string, data: any) {
    try {
      await this.request(`/integration/conference-sessions/${id}`, {
        method: 'PATCH',
        data
      });
    } catch (error) {
      throw new IvaRequestError({ detail: toErrorWithMessage(error).message });
    }
  }

  async findConference(id: string) {
    try {
      const conference = await this.request(`/integration/conference-sessions/${id}`);

      return conference;
    } catch (error) {
      throw new IvaRequestError({ detail: toErrorWithMessage(error).message });
    }
  }

  async addConferenceParticipants(id: string, participants: IvaParticipant[]) {
    try {
      await this.request(`/integration/conference-sessions/${id}/participants/add`, {
        method: 'POST',
        data: participants
      });
    } catch (error) {
      throw new IvaRequestError({ detail: toErrorWithMessage(error).message });
    }
  }

  async findConferenceParticipants(id: string, query: any) {
    try {
      const participants = await this.request(
        `/integration/conference-sessions/${id}/participants`,
        { query }
      );

      return participants;
    } catch (error) {
      throw new IvaRequestError({ detail: toErrorWithMessage(error).message });
    }
  }

  async removeConferenceParticipants(id: string, profileIds: string[]) {
    try {
      await this.request(`/integration/conference-sessions/${id}/participants/remove`, {
        method: 'POST',
        data: profileIds
      });
    } catch (error) {
      throw new IvaRequestError({ detail: toErrorWithMessage(error).message });
    }
  }

  async findUsers(searchString?: string, limit: number = 20, offset: number = 0) {
    try {
      const query = {
        searchString,
        limit: limit.toString(),
        offset: offset.toString(),
        domainId: this.getIvaDomainId()
      };

      const users = await this.request('/integration/users', { query });

      return users;
    } catch (error) {
      // @TODO: check api reasons and statuses
      throw new IvaRequestError({ detail: toErrorWithMessage(error).message });
    }
  }

  async createUser(data: IvaUserCreateData) {
    try {
      const user = await this.request('/integration/users', {
        method: 'POST',
        data: { ...data, domainId: this.getIvaDomainId() }
      });

      return user;
    } catch (error) {
      throw new IvaRequestError({ detail: toErrorWithMessage(error).message });
    }
  }

  async updateUser(id: string, data: any) {
    try {
      const updatedUser = await this.request(`/integration/users/${id}`, {
        method: 'PATCH',
        data
      });

      return updatedUser;
    } catch (error) {
      throw new IvaRequestError({ detail: toErrorWithMessage(error).message });
    }
  }

  async removeUser(id: string) {
    try {
      await this.request(`/integration/users/${id}`, { method: 'DELETE' });
    } catch (error) {
      throw new IvaRequestError({ detail: toErrorWithMessage(error).message });
    }
  }
}
