import { DivisionHierarchy, DivisionHierarchyNode } from '@prisma/client';

export type DivisionHierarchyWithNodes = DivisionHierarchy & {
  nodes: DivisionHierarchyNodeWithNodes[];
};

export type DivisionHierarchyNodeWithNodes = DivisionHierarchyNode & {
  nodes: DivisionHierarchyNodeWithNodes[];
};
