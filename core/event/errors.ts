import { makeErrorDictionary } from '@/lib/problem-json';

export const { EventNotFoundError } = makeErrorDictionary()({
  EventNotFoundError: {
    type: 'urn-problem-type:event-not-found',
    title: 'Событие не найдено',
    status: 404
  }
});
