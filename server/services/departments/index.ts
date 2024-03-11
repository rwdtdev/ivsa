import prisma from '@/server/services/prisma';
import { NotFoundError } from '@/lib/problem-json';
import { TransactionSession } from '@/types/prisma';
import { Department, PrismaClient } from '@prisma/client';

export default class DepartmentService {
  private prisma: PrismaClient | TransactionSession;

  constructor(transactionSession?: TransactionSession) {
    this.prisma = transactionSession ?? prisma;
  }

  static withSession(session: TransactionSession) {
    return new this(session);
  }

  async assertExist(id: string, status: number = 404): Promise<void> {
    const count = await this.prisma.department.count({ where: { id } });

    if (!count || count === 0) {
      throw new NotFoundError({ detail: `Department with id (${id}) not found`, status });
    }
  }

  async getAll(): Promise<Department[]> {
    return prisma.department.findMany();
  }
}
