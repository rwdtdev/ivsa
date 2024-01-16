import { Department } from '@prisma/client';

export type DepartmentView = Omit<Department, 'id' | 'organisationId'>;
