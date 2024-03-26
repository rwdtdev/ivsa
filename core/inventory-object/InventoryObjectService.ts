import prisma from '@/core/prisma';
import { TransactionSession } from '@/types/prisma';
import { InventoryObject, PrismaClient } from '@prisma/client';
import { InventoryObjectCreateData } from './types';

export class InventoryObjectService {
  private prisma: PrismaClient | TransactionSession;

  constructor(transactionSession?: TransactionSession) {
    this.prisma = transactionSession || prisma;
  }

  withSession(session: TransactionSession) {
    return new InventoryObjectService(session);
  }

  async create(data: InventoryObjectCreateData): Promise<InventoryObject> {
    const inventoryObject = await this.prisma.inventoryObject.create({ data });

    return inventoryObject;
  }

  async update(data: InventoryObjectCreateData): Promise<InventoryObject> {
    await this.prisma.inventoryObject.deleteMany({
      where: { inventoryId: data.inventoryId }
    });

    const updatedInventoryObject = await this.prisma.inventoryObject.create({ data });

    return updatedInventoryObject;
  }

  async removeByInventoryId(inventoryId: string) {
    await this.prisma.inventoryObject.deleteMany({ where: { inventoryId } });
  }
}
