import { makeErrorDictionary } from '@/lib/problem-json';

export const { DivisionHierarchyErrors } = makeErrorDictionary()({
  DivisionHierarchyErrors: {
    AlreadyContainNodes: {
      type: 'urn:problem-type:division-hierarchy-already-contains-nodes-error',
      title: 'Иерархия уже содержит один или более узлов',
      status: 400
    },
    AlreadyHaveMaximumPartitions: {
      type: 'urn:problem-type:division-hierarchy-already-have-maximum-partitions-error',
      title: 'Иерархия уже заполнена',
      status: 400
    }
  }
});
