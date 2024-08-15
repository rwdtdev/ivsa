import prisma from '@/core/prisma';
import { TransactionSession } from '@/types/prisma';
import { InventoryLocation, PrismaClient } from '@prisma/client';
import { InventoryLocationCreateData } from './types';
import moment from 'moment';

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

  async getCountByPeriod({
    inventoryId,
    period
  }: {
    inventoryId: string;
    period?: string;
  }) {
    const current = moment();

    return await this.prisma.inventoryLocation.count({
      where: {
        inventoryId,
        ...(period === 'hour' && {
          dateTime: { gte: current.startOf('hour').toDate() }
        }),
        ...(period === 'day' && {
          dateTime: { gte: current.startOf('day').toDate() }
        })
      }
    });
  }

  async getLastBy(params: any) {
    return await this.prisma.inventoryLocation.findFirst({
      where: { ...params },
      orderBy: { dateTime: 'desc' }
    });
  }
}
