import { TransactionSession } from './prisma';
import { UserView } from './user';

export type UserTableView = Omit<UserView, 'organisationId' | 'departmentId'> & {
  departmentName?: string;
  organisationName?: string;
};

export type WithSession<T> = Omit<T, 'prisma'> & {
  prisma: TransactionSession;
};
