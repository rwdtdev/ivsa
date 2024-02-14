import * as users from './users';
import * as conferenceSessions from './conference-sessions';
import { ivaRequest } from '../request';
import { getIvaDomainId } from '../helpers';

export const getServerStatus = async () => {
  const baseUrl = process.env.IVA_API_URL;
  const res = await fetch(`${baseUrl}/public/system/info`, { cache: 'no-cache' });
  const data = await res.json();

  return data;
};

export const findConferenceTemplates = async () => {
  const templates = await ivaRequest('/integration/conference-templates', {
    query: { domainId: getIvaDomainId() }
  });

  return templates;
};

export default {
  users,
  conferenceSessions,
  getServerStatus
};
