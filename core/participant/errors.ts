import { makeErrorDictionary } from '@/lib/problem-json';

export const { ContainAlreadyExistParticipantsError } = makeErrorDictionary()({
  ContainAlreadyExistParticipantsError: {
    type: 'urn:problem-type:contain-already-exist-parrticipants-error',
    title: 'Часть пользователей уже являются участниками описи',
    status: 400
  }
});
