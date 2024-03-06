import { makeErrorDictionary } from '@/lib/problem-json';

export const {
  BriefingRoomAlreadyExist,
  BriefingParticipantsMustContainSpeaker,
  NotRegisteredUserInIvaError
} = makeErrorDictionary()({
  BriefingRoomAlreadyExist: {
    type: 'urn:problem-type:briefing-room-already-exist',
    title: 'Комната видеоинструктажа уже существует',
    status: 409
  },
  BriefingParticipantsMustContainSpeaker: {
    type: 'urn:problem-type:briefing-participants-must-contain-speaker',
    title: 'Комната инструктажа не может быть открыта без председателя',
    status: 409
  },
  NotRegisteredUserInIvaError: {
    type: 'urn:problem-type:not-registered-user-in-iva-error',
    title: 'Не зарегистрированный пользователь в IVA R',
    status: 409
  }
});
