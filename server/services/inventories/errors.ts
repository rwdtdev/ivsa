import { makeErrorDictionary } from '@/lib/problem-json';

export const {
  InventoryAlreadyExistError,
  InventoryNotExistError,
  InventoryNotBelongEventError
} = makeErrorDictionary()({
  InventoryAlreadyExistError: {
    type: 'urn:problem-type:inventory-already-exist-error',
    title: 'Опись уже существует',
    status: 400
  },
  InventoryNotBelongEventError: {
    type: 'urn:problem-type:inventory-not-belong-event-error',
    title: 'Опись не входит в событие инвентаризации',
    status: 400
  },
  InventoryNotExistError: {
    type: 'urn:problem-type:inventory-not-exist-error',
    title: 'Опись не существует',
    status: 404
  }
});
