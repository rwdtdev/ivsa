import prisma from '@/core/prisma';
import { TransactionSession } from '@/types/prisma';
import { InventoryObject, PrismaClient } from '@prisma/client';
import { InventoryObjectCreateData } from './types';
import { InventoryObjectsGetData } from '../event/types';
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
    const { page = 1, limit = defaultLimit, searchTerm, sort } = data;

    const containsSearchTerm = { contains: searchTerm, mode: 'insensitive' };

    const where = {
      where: {
        ...(searchTerm && {
          OR: [
            { name: containsSearchTerm },
            { serialNumber: containsSearchTerm },
            { inventoryNumber: containsSearchTerm },
            { batchNumber: containsSearchTerm },
            { placement: containsSearchTerm },
            { networkNumber: containsSearchTerm },
            { location: containsSearchTerm }
          ]
        }),
        inventoryId
      }
    };

    // @ts-expect-error types
    const totalCount = await prisma.inventoryObject.count({ ...where });

    // @ts-expect-error types
    const inventoryObjects = await this.prisma.inventoryObject.findMany({
      ...where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sort.by]: sort.direction }
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
