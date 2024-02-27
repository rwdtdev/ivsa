import { getIvaDomainId } from '../helpers';
import { ivaRequest } from '../request';
import { IvaConferenceSessionCreateRoomData, IvaParticipant } from '../types';

export const createRoom = async (data: IvaConferenceSessionCreateRoomData) => {
  try {
    const createdRoom = await ivaRequest('/integration/conference-sessions/create-room', {
      method: 'POST',
      data: { ...data, domainId: getIvaDomainId() }
    });

    return createdRoom;
  } catch (error) {
    console.log(error);
    // do something
  }
};

export const closeRoom = async (id: string) => {
  try {
    await ivaRequest(`/integration/conference-sessions/${id}`, { method: 'DELETE' });
  } catch (error) {
    console.log(error);
    // do something
  }
};

export const update = async (id: string, data: IvaConferenceSessionUpdateData) => {
  try {
    await ivaRequest(`/integration/conference-sessions/${id}`, {
      method: 'PATCH',
      data
    });
  } catch (error) {
    // do something
  }
};

export const find = async (id: string) => {
  try {
    const conference = await ivaRequest(`/integration/conference-sessions/${id}`);

    return conference;
  } catch (error) {
    // do something
  }
};

export const addParticipants = async (id: string, participants: IvaParticipant[]) => {
  try {
    await ivaRequest(`/integration/conference-sessions/${id}/participants/add`, {
      method: 'POST',
      data: participants
    });
  } catch (error) {
    // do something
  }
};

export const findParticipants = async (
  id: string,
  query: IvaConferenceSessionFindParticipantsQuery
) => {
  try {
    const participants = await ivaRequest(
      `/integration/conference-sessions/${id}/participants`,
      { query }
    );

    return participants;
  } catch (error) {
    // do something
  }
};

export const removeParticipants = async (id: string, profileIds: string[]) => {
  try {
    await ivaRequest(`/integration/conference-sessions/${id}/participants/remove`, {
      method: 'POST',
      data: profileIds
    });
  } catch (error) {
    // do something
  }
};

// Not need??
export const start = () => {};
