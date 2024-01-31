import { Department } from '@prisma/client';

export const getAllDepartments = async (): Promise<Department[]> => {
  return prisma.department.findMany();
};
