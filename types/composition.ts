import { TransactionSession } from './prisma';

export type WithSession<T> = Omit<T, 'prisma'> & {
  prisma: TransactionSession;
};
