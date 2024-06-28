import prisma from '@/core/prisma';
import { InventoryCreateData, InventoryWithObjects } from '@/core/inventory/types';
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
    this.prisma = session || prisma;
  }

  withSession(session: TransactionSession) {
    return new InventoryService(session);
  }

  async assertNotExist(id: string, eventId: string) {
    const count = await this.prisma.inventory.count({ where: { id, eventId } });

    if (count && count > 0) {
      throw new InventoryAlreadyExistError();
    }
  }

  async isAlreadyExistForEvent(id: string, eventId: string) {
    const count = await this.prisma.inventory.count({ where: { id, eventId } });

    return count && count > 0;
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

  async remove(id: string, eventId: string) {
    return this.prisma.inventory.delete({ where: { id, eventId } });
  }

  async removeLogical(id: string) {
    await this.prisma.inventory.updateMany({
      data: { status: InventoryStatus.REMOVED },
      where: {
        OR: [{ id }, { parentId: id }]
      }
    });
  }

  async assertExistAndBelongEvent(id: string, eventId: string) {
    const inventory = await this.prisma.inventory.findFirst({ where: { id, eventId } });

    if (!inventory) {
      throw new InventoryNotExistError();
    }
  }

  async getByIdAndEventId(id: string, eventId: string): Promise<InventoryWithObjects> {
    const inventory = await this.prisma.inventory.findFirst({
      where: { id, eventId },
      include: { objects: true, resources: true }
    });

    if (!inventory) {
      throw new InventoryNotExistError();
    }

    return inventory;
  }

  async getByConferenceId(conferenceId: string) {
    const inventory = await this.prisma.inventory.findFirst({
      include: {
        event: {
          select: {
            id: true,
            orderId: true,
            orderDate: true,
            orderNumber: true
          }
        }
      },
      where: {
        auditSessionId: conferenceId
      }
    });

    if (!inventory) {
      throw new InventoryNotExistError();
    }

    return inventory;
  }

  async getById(id: string) {
    const inventory = await this.prisma.inventory.findFirst({
      where: {id}
    })

    return inventory || null;
  }

  async getByIdAndEvent(
    id: string,
    eventId: string
  ): Promise<InventoryWithObjects | null> {
    const inventory = await this.prisma.inventory.findFirst({
      where: { id, eventId },
      include: { objects: true }
    });

    return inventory || null;
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

  async findBy(query: Partial<Omit<Inventory, 'videoFilesUrls'>>): Promise<Inventory[]> {
    const inventories = await this.prisma.inventory.findMany({
      where: query,
    });

    return inventories;
  }

  async findOneIndividualBy(
    query: Partial<Omit<Inventory, 'videoFilesUrls'>>
  ): Promise<Inventory | null> {
    const inventory = await this.prisma.inventory.findFirst({
      where: {
        ...query,
        parentId: { not: null }
      }
    });

    return inventory || null;
  }
}
