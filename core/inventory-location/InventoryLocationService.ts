import prisma from '@/core/prisma';
import { TransactionSession } from '@/types/prisma';
import { InventoryLocation, PrismaClient } from '@prisma/client';
import { InventoryLocationCreateData } from './types';

export class InventoryLocationService {
  private prisma: PrismaClient | TransactionSession;

  constructor(session?: TransactionSession) {
    this.prisma = session || prisma;
  }

  withSession(session: TransactionSession) {
    return new InventoryLocationService(session);
  }

  async create(data: InventoryLocationCreateData): Promise<InventoryLocation> {
    const inventoryLocation = await this.prisma.inventoryLocation.create({ data });

    return inventoryLocation;
  }
}
