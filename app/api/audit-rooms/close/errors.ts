import { makeErrorDictionary } from '@/lib/problem-json';

export const { AuditRoomIsNotOpened } = makeErrorDictionary()({
  AuditRoomIsNotOpened: {
    type: 'urn:problem-type:audit-room-already-exist',
    title: 'Комната видеоинвентаризации не открыта',
    status: 409
  }
});
