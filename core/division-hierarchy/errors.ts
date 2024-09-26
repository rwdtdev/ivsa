import { makeErrorDictionary } from '@/lib/problem-json';

export const { DivisionHierarchyErrors } = makeErrorDictionary()({
  DivisionHierarchyErrors: {
    AlreadyContainNodes: {
      type: 'urn:problem-type:division-hierarchy-already-contains-nodes-error',
      title: 'Иерархия уже содержит один или более узлов',
      status: 400
    },
    AlreadyHaveMaximumNodes: {
      type: 'urn:problem-type:division-hierarchy-already-have-maximum-nodes-error',
      title: 'Иерархия уже содержит максимальное количество узлов',
      status: 400
    }
  }
});
