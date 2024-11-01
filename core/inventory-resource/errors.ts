import { makeErrorDictionary } from '@/lib/problem-json';

export const { InventoryResourceErrors } = makeErrorDictionary()({
  InventoryResourceErrors: {
    NotFound: {
      type: 'urn:problem-type:resource-not-found-error',
      title: 'Видео-ресурс не существует',
      status: 404
    }
  }
});
