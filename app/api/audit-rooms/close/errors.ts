import errors from '@/lib/problem-json';
import { makeErrorDictionary } from '@/lib/problem-json';

export const { AuditRoomIsNotOpened } = makeErrorDictionary()({
  ...errors,
  AuditRoomIsNotOpened: {
    type: 'urn:problem-type:audit-room-already-exist',
    title: 'Комната видеоинвентаризации не открыта',
    status: 409
  }
});
