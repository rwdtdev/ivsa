import prisma from '@/core/prisma';
import { NotFoundError } from '@/lib/problem-json';
import { TransactionSession } from '@/types/prisma';
import { Department, PrismaClient } from '@prisma/client';

export class DepartmentService {
  private prisma: PrismaClient | TransactionSession;

  constructor(session?: TransactionSession) {
    this.prisma = session || prisma;
  }

  withSession(session: TransactionSession) {
    return new DepartmentService(session);
  }

  async assertExist(id: string, status: number = 404) {
    const count = await this.prisma.department.count({ where: { id } });

    if (!count || count === 0) {
      throw new NotFoundError({
        detail: `Department with id (${id}) not found`,
        status
      });
    }
  }

  async getAll(): Promise<Department[]> {
    return prisma.department.findMany();
  }
}
