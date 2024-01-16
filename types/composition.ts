import { Department, Organisation } from '@prisma/client';
import { UserView } from './user';

export type UserTableView = Omit<UserView, 'organisationId' | 'departmentId'> & {
  departmentName?: string;
  organisationName?: string;
};
