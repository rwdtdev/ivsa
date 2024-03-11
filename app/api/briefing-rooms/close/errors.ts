import { makeErrorDictionary } from '@/lib/problem-json';

export const { BriefingRoomIsNotOpened } = makeErrorDictionary()({
  BriefingRoomIsNotOpened: {
    type: 'urn:problem-type:briefing-room-already-exist',
    title: 'Комната видеоинструктажа не открыта',
    status: 409
  }
});
