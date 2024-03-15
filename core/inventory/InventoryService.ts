import { InventoryCreateData } from '@/core/inventory/types';
import { TransactionSession } from '@/types/prisma';
import { Inventory, InventoryStatus, PrismaClient } from '@prisma/client';
import {
  InventoryAlreadyExistError,
  InventoryNotExistError,
  ComplexAndIndividualInventoriesIsUnrelatedError
} from './errors';

export class InventoryService {
  private prisma: PrismaClient | TransactionSession;

  constructor(session?: TransactionSession) {
    this.prisma = session ?? prisma;
  }

  withSession(session: TransactionSession) {
    return new InventoryService(session);
  }

  async assertNotExist(id: string) {
    const count = await this.prisma.inventory.count({ where: { id } });

    if (count && count > 0) {
      throw new InventoryAlreadyExistError();
    }
  }

  async assertExist(id: string) {
    const count = await this.prisma.inventory.count({ where: { id } });

    if (!count || count === 0) {
      throw new InventoryNotExistError();
    }
  }

  async assertIsParent(inventoryId: string, individualInventoryId: string) {
    const count = await this.prisma.inventory.count({
      where: { id: individualInventoryId, parentId: inventoryId }
    });

    if (!count || count === 0) {
      throw new ComplexAndIndividualInventoriesIsUnrelatedError({
        detail: `Complex inventory (${inventoryId}) not contain individual (${individualInventoryId})`
      });
    }
  }

  async removeInventoryLogical(id: string) {
    return this.prisma.inventory.update({
      data: { status: InventoryStatus.REMOVED },
      where: { id }
    });
  }

  async assertExistAndBelongEvent(id: string, eventId: string) {
    const inventory = await this.prisma.inventory.findFirst({ where: { id, eventId } });

    if (!inventory) {
      throw new InventoryNotExistError();
    }
  }

  async getById(id: string): Promise<Inventory> {
    const inventory = await this.prisma.inventory.findFirst({ where: { id } });

    if (!inventory) {
      throw new InventoryNotExistError();
    }

    return inventory;
  }

  async create(data: InventoryCreateData): Promise<Inventory> {
    const inventory = await this.prisma.inventory.create({
      data: { ...data, status: InventoryStatus.AVAILABLE }
    });

    return inventory;
  }

  async update(id: string, data: Partial<Inventory>) {
    const updatedInventory = await this.prisma.inventory.update({
      data,
      where: { id }
    });

    return updatedInventory;
  }
}
