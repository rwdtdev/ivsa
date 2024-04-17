import prisma from '@/core/prisma';
import { TransactionSession } from '@/types/prisma';
import { InventoryObject, PrismaClient } from '@prisma/client';
import { InventoryObjectCreateData } from './types';
import { InventoryObjectsGetData } from '../event/types';
import { SortOrder } from '@/constants/data';
import { PaginatedResponse } from '@/types';

const defaultLimit = 100;

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

  async getByInventoryId(
    inventoryId: string,
    data: InventoryObjectsGetData
  ): Promise<PaginatedResponse<InventoryObject>> {
    const { page = 1, limit = defaultLimit, sortDirection = SortOrder.Descending } = data;

    const where = {
      where: {
        inventoryId
      }
    };

    const totalCount = await prisma.inventoryObject.count({ ...where });

    const inventoryObjects = await this.prisma.inventoryObject.findMany({
      ...where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: sortDirection }
    });

    return {
      items: inventoryObjects,
      pagination: {
        total: totalCount,
        pagesCount: Math.ceil(totalCount / limit),
        currentPage: page,
        perPage: limit,
        from: (page - 1) * limit + 1,
        to: (page - 1) * limit + inventoryObjects.length,
        hasMore: page < Math.ceil(totalCount / limit)
      }
    };
  }
}
