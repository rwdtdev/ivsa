import { DivisionHierarchy, DivisionHierarchyNode } from '@prisma/client';

export type DivisionHierarchyWithNodes = DivisionHierarchy & {
  divisionHierarchyNodes: DivisionHierarchyNode;
};
