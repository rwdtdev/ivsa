import errors from '@/lib/problem-json';
import { makeErrorDictionary } from '@/lib/problem-json';

export const {
  EventParticipantsMustBeNotEmptyError,
  EventParticipantsMustContainSpeakerError,
  SpeakerIsNotRegisteredInIvaError
} = makeErrorDictionary()({
  ...errors,
  EventParticipantsMustBeNotEmptyError: {
    type: 'urn:problem-type:event-participants-must-be-not-empty-error',
    title: 'Событие должно содержать участников',
    status: 409
  },
  EventParticipantsMustContainSpeakerError: {
    type: 'urn:problem-type:event-participants-must-contain-speaker-error',
    title: 'Событие должно содержать председателя в списке участников',
    status: 409
  },
  SpeakerIsNotRegisteredInIvaError: {
    type: 'urn:problem-type:speaker-is-not-registered-in-iva-error',
    title: 'Председателя события нет в списке зарегистрированных пользователей в IVA R',
    status: 409
  }
});
