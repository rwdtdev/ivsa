import { TransactionSession } from '@/types/prisma';
import prisma from '@/server/services/prisma';
import { Prisma } from '@prisma/client';

// eslint-disable-next-line @typescript-eslint/ban-types
export const doTransaction = async (fn: Function): Promise<any> => {
  return await prisma.$transaction(
    async (session: TransactionSession) => {
      const result = await fn(session);
      return result;
    },
    {
      // set highest level of isolation for transactions
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable
    }
  );
};
