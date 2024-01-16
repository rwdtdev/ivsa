import { Organisation } from '@prisma/client';

export const getAllOrgnaisations = async (): Promise<Organisation[]> => {
  return prisma.organisation.findMany();
};
