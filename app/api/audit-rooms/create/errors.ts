import { makeErrorDictionary } from '@/lib/problem-json';

export const { BriefingRoomIsStillOpenError, EmptyPartisipantsListError } =
  makeErrorDictionary()({
    BriefingRoomIsStillOpenError: {
      type: 'urn:problem-type:briefing-room-is-still-open-error',
      title: 'Инструктаж еще не окончен',
      status: 409
    },
    EmptyPartisipantsListError: {
      type: 'urn:problem-type:empty-participatns-list-error',
      title: 'Список участников не может быть пустым',
      status: 400
    }
  });
