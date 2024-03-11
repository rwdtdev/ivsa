import { makeErrorDictionary } from '@/lib/problem-json';

export const {
  EventParticipantsMustContainSpeakerError,
  SpeakerIsNotRegisteredInAsviError,
  SpeakerIsNotRegisteredInIvaError,
  EventNotFoundError
} = makeErrorDictionary()({
  EventParticipantsMustContainSpeakerError: {
    type: 'urn:problem-type:event-participants-must-contain-speaker-error',
    title: 'Событие должно содержать председателя в списке участников',
    status: 409
  },
  SpeakerIsNotRegisteredInAsviError: {
    type: 'urn:problem-type:speaker-is-not-registered-in-asvi-error',
    title: 'Председателя события нет в списке зарегистрированных пользователей в AS VI',
    status: 409
  },
  SpeakerIsNotRegisteredInIvaError: {
    type: 'urn:problem-type:speaker-is-not-registered-in-iva-error',
    title: 'Председателя события нет в списке зарегистрированных пользователей в IVA R',
    status: 409
  },
  EventNotFoundError: {
    type: 'urn-problem-type:event-not-found',
    title: 'Событие не найдено',
    status: 404
  }
});
