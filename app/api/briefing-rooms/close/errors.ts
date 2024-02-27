import errors from '@/lib/problem-json';
import { makeErrorDictionary } from '@/lib/problem-json';

export const { BriefingRoomIsNotOpened } = makeErrorDictionary()({
  ...errors,
  BriefingRoomIsNotOpened: {
    type: 'urn:problem-type:briefing-room-already-exist',
    title: 'Комната видеоинструктажа не открыта',
    status: 409
  }
});
