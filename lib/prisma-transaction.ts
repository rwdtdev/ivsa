import ApiError from '@/server/utils/error';
import { TransactionSession } from '@/types/prisma';
import { Prisma } from '@prisma/client';

export const doTransaction = async (fn: Function): Promise<any> => {
  return await prisma.$transaction(
    async (session: TransactionSession) => {
      try {
        const result = await fn(session);
        return result;
      } catch (err) {
        throw new ApiError(`Server Error: ${err}`, 500);
      }
    },
    {
      // set highest level of isolation for transactions
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable
    }
  );
};
