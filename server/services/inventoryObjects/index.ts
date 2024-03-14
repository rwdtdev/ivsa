import { TransactionSession } from '@/types/prisma';
import { InventoryObject, PrismaClient } from '@prisma/client';
import { InventoryObjectCreateData } from './types';

export class InventoryObjectService {
  private prisma: PrismaClient | TransactionSession;

  constructor(transactionSession?: TransactionSession) {
    this.prisma = transactionSession ?? prisma;
  }

  static withSession(session: TransactionSession) {
    return new this(session);
  }

  async create(data: InventoryObjectCreateData): Promise<InventoryObject> {
    const inventoryObject = await this.prisma.inventoryObject.create({ data });

    return inventoryObject;
  }
}
