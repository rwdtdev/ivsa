'use server';

import { DivisionHierarchyService } from '@/core/division-hierarchy/DivisionHierarchyService';

export const getDivisionHierarchies = async () => {
  const divisionHierarchyService = new DivisionHierarchyService();

  const divisionHierarchies = await divisionHierarchyService.getAll();

  return divisionHierarchies;
};

export const getDivisionById = async (id: string) => {
  const divisionHierarchyService = new DivisionHierarchyService();
  const res = await divisionHierarchyService.getDivisionNodeById(id);
  return res;
};
