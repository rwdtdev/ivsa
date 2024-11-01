import { TransactionSession } from '@/types/prisma';
import { InventoryResource, PrismaClient } from '@prisma/client';
import { InventoryResourceErrors } from './errors';

export class InventoryResourceService {
  private prisma: PrismaClient | TransactionSession;

  constructor(transactionSession?: TransactionSession) {
    this.prisma = transactionSession || prisma;
  }

  withSession(session: TransactionSession) {
    return new InventoryResourceService(session);
  }

  async getById(id: string): Promise<InventoryResource> {
    const resource = await this.prisma.inventoryResource.findUnique({
      where: { id }
    });

    if (!resource) {
      throw new InventoryResourceErrors.NotFound({
        details: `Resource with id "${id}" not found`
      });
    }

    return resource;
  }
}
