import errors from '@/lib/problem-json';
import { makeErrorDictionary } from '@/lib/problem-json';

export const { BriefingRoomIsStillOpenError } = makeErrorDictionary()({
  ...errors,
  BriefingRoomIsStillOpenError: {
    type: 'urn:problem-type:briefing-room-is-still-open-error',
    title: 'Инструктаж еще не окончен',
    status: 409
  }
});
