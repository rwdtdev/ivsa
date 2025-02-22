import { makeErrorDictionary } from '@/lib/problem-json';

export const {
  BriefingRoomAlreadyExistError,
  BriefingParticipantsMustContainSpeaker,
  NotRegisteredUserInIvaError,
  EventParticipantsMustBeNotEmptyError,
  BriefingRoomIsNotOpened,
  BriefingAlreadyEndError
} = makeErrorDictionary()({
  EventParticipantsMustBeNotEmptyError: {
    type: 'urn:problem-type:event-participants-must-be-not-empty-error',
    title: 'Событие должно содержать участников',
    status: 409
  },
  BriefingRoomAlreadyExistError: {
    type: 'urn:problem-type:briefing-room-already-exist-error',
    title: 'Комната видеоинструктажа уже существует',
    status: 409
  },
  BriefingParticipantsMustContainSpeakerError: {
    type: 'urn:problem-type:briefing-participants-must-contain-speaker-error',
    title: 'Комната инструктажа не может быть открыта без председателя',
    status: 409
  },
  NotRegisteredUserInIvaError: {
    type: 'urn:problem-type:not-registered-user-in-iva-error',
    title: 'Не зарегистрированный пользователь в IVA R',
    status: 409
  },
  BriefingRoomIsNotOpened: {
    type: 'urn:problem-type:briefing-room-is-not-opened',
    title: 'Комната видеоинструктажа не открыта',
    status: 409
  },
  BriefingAlreadyEndError: {
    type: 'urn:problem-type:briefing-already-end-error',
    title: 'Видеоинструктаж уже завершен',
    status: 409
  }
});
