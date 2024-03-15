import prisma from '@/core/prisma';
import { NotFoundError } from '@/lib/problem-json';
import { TransactionSession } from '@/types/prisma';
import { Organisation, PrismaClient } from '@prisma/client';

export class OrganisationService {
  private prisma: PrismaClient | TransactionSession;

  constructor(session?: TransactionSession) {
    this.prisma = session ?? prisma;
  }

  withSession(session: TransactionSession) {
    return new OrganisationService(session);
  }

  async assertExist(id: string, status: number = 404) {
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
