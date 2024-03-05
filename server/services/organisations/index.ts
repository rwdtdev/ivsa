import { NotFoundError } from '@/lib/problem-json';
import { TransactionSession } from '@/types/prisma';
import { Organisation, PrismaClient } from '@prisma/client';

export default class OrganisationService {
  private prisma: PrismaClient | TransactionSession;

  constructor(transactionSession?: TransactionSession) {
    this.prisma = transactionSession ?? prisma;
  }

  static withSession(session: TransactionSession) {
    return new this(session);
  }

  async assertExist(id: string, status: number = 404): Promise<void> {
    const count = await this.prisma.organisation.count({ where: { id } });

    if (!count || count === 0) {
      throw new NotFoundError({
        detail: `Organisation with id (${id}) not found`,
        status
      });
    }
  }

  async getAll(): Promise<Organisation[]> {
    return prisma.organisation.findMany();
  }
}
