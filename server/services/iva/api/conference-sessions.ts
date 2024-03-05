import { toErrorWithMessage } from '@/lib/helpers';
import { getIvaDomainId } from '../helpers';
import { ivaRequest } from '../request';
import { IvaConferenceSessionCreateRoomData, IvaParticipant } from '../types';
import { IvaRequestError } from './errors';

export const createRoom = async (data: IvaConferenceSessionCreateRoomData) => {
  try {
    const createdRoom = await ivaRequest('/integration/conference-sessions/create-room', {
      method: 'POST',
      data: { ...data, domainId: getIvaDomainId() }
    });

    return createdRoom;
  } catch (error) {
    throw new IvaRequestError({ detail: toErrorWithMessage(error).message });
  }
};

export const closeRoom = async (id: string) => {
  try {
    await ivaRequest(`/integration/conference-sessions/${id}`, { method: 'DELETE' });
  } catch (error) {
    throw new IvaRequestError({ detail: toErrorWithMessage(error).message });
  }
};

export const update = async (id: string, data: any) => {
  try {
    await ivaRequest(`/integration/conference-sessions/${id}`, {
      method: 'PATCH',
      data
    });
  } catch (error) {
    throw new IvaRequestError({ detail: toErrorWithMessage(error).message });
  }
};

export const find = async (id: string) => {
  try {
    const conference = await ivaRequest(`/integration/conference-sessions/${id}`);

    return conference;
  } catch (error) {
    throw new IvaRequestError({ detail: toErrorWithMessage(error).message });
  }
};

export const addParticipants = async (id: string, participants: IvaParticipant[]) => {
  try {
    await ivaRequest(`/integration/conference-sessions/${id}/participants/add`, {
      method: 'POST',
      data: participants
    });
  } catch (error) {
    throw new IvaRequestError({ detail: toErrorWithMessage(error).message });
  }
};

export const findParticipants = async (id: string, query: any) => {
  try {
    const participants = await ivaRequest(
      `/integration/conference-sessions/${id}/participants`,
      { query }
    );

    return participants;
  } catch (error) {
    throw new IvaRequestError({ detail: toErrorWithMessage(error).message });
  }
};

export const removeParticipants = async (id: string, profileIds: string[]) => {
  try {
    await ivaRequest(`/integration/conference-sessions/${id}/participants/remove`, {
      method: 'POST',
      data: profileIds
    });
  } catch (error) {
    throw new IvaRequestError({ detail: toErrorWithMessage(error).message });
  }
};

// Not need??
export const start = () => {};
