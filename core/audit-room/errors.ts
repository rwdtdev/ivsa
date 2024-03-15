import { makeErrorDictionary } from '@/lib/problem-json';

export const {
  BriefingRoomIsStillOpenError,
  EmptyPartisipantsListError,
  AuditRoomIsNotOpened
} = makeErrorDictionary()({
  BriefingRoomIsStillOpenError: {
    type: 'urn:problem-type:briefing-room-is-still-open-error',
    title: 'Инструктаж еще не окончен',
    status: 409
  },
  EmptyPartisipantsListError: {
    type: 'urn:problem-type:empty-participatns-list-error',
    title: 'Список участников пуст',
    status: 400
  },
  AuditRoomIsNotOpened: {
    type: 'urn:problem-type:audit-room-is-not-opened',
    title: 'Комната видеоинвентаризации не открыта',
    status: 409
  }
});
