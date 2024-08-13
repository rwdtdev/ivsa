import { makeErrorDictionary } from '@/lib/problem-json';

export const {
  BriefingRoomIsStillOpenError,
  EmptyPartisipantsListError,
  AuditRoomIsNotOpened,
  AuditRoomAlreadyClosed,
  AuditRoomAlreadyOpenedOrEndedError,
  ParticipantsMustContainModeratorError
} = makeErrorDictionary()({
  ParticipantsMustContainModeratorError: {
    type: 'urn:problem-type:participants-must-contain-moderator-error',
    title: 'В списках участников должен быть модератор',
    status: 409
  },
  BriefingRoomIsStillOpenError: {
    type: 'urn:problem-type:briefing-room-is-still-open-error',
    title: 'Инструктаж еще не окончен',
    status: 409
  },
  EmptyPartisipantsListError: {
    type: 'urn:problem-type:empty-participatns-list-error',
    title: 'Список зарегистрированных участников пуст',
    status: 400
  },
  AuditRoomIsNotOpened: {
    type: 'urn:problem-type:audit-room-is-not-opened',
    title: 'Комната видеоинвентаризации не открыта',
    status: 409
  },
  AuditRoomAlreadyOpenedOrEndedError: {
    type: 'urn:problem-type:audit-room-already-opened-or-ended-error',
    title: 'Инвентаризации по описи уже начата или окончена',
    status: 409
  },
  AuditRoomAlreadyClosed: {
    type: 'urn:problem-type:audit-room-already-closed-error',
    title: 'Комната инвентаризационной описи уже закрыта',
    status: 409
  }
});
