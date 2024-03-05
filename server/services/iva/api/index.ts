import * as users from './users';
import * as conferenceSessions from './conference-sessions';
import { ivaRequest } from '../request';
import { getIvaDomainId } from '../helpers';
import { IvaRequestError } from './errors';
import { toErrorWithMessage } from '@/lib/helpers';

export const getServerStatus = async () => {
  try {
    const baseUrl = process.env.IVA_API_URL;
    const res = await fetch(`${baseUrl}/public/system/info`, { cache: 'no-cache' });
    const data = await res.json();

    return data;
  } catch (error) {
    throw new IvaRequestError({ detail: toErrorWithMessage(error).message });
  }
};

export const findConferenceTemplates = async () => {
  try {
    const templates = await ivaRequest('/integration/conference-templates', {
      query: { domainId: getIvaDomainId() }
    });

    return templates;
  } catch (error) {
    throw new IvaRequestError({ detail: toErrorWithMessage(error).message });
  }
};

export default {
  users,
  conferenceSessions,
  getServerStatus
};
