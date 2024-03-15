import { makeErrorDictionary } from '@/lib/problem-json';

export const {
  InventoryAlreadyExistError,
  InventoryNotExistError,
  InventoryNotBelongEventError,
  ComplexAndIndividualInventoriesIsUnrelatedError
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
  },
  ComplexAndIndividualInventoriesIsUnrelatedError: {
    type: 'urn:problem-type:complex-and-individual-inventories-is-unrelated-error',
    title: 'Комплексная и индивидуальная описи не имеют связи',
    status: 404
  }
});
