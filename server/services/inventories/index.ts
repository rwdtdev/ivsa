import _ from 'underscore';
import { InventoryCreateData } from '@/server/services/inventories/types';
import { TransactionSession } from '@/types/prisma';
import { Inventory, PrismaClient } from '@prisma/client';
import {
  InventoryAlreadyExistError,
  InventoryNotExistError,
  InventoryNotBelongEventError
} from './errors';

export class InventoryService {
  private prisma: PrismaClient | TransactionSession;

  constructor(transactionSession?: TransactionSession) {
    this.prisma = transactionSession ?? prisma;
  }

  static withSession(session: TransactionSession) {
    return new this(session);
  }

  async assertNotExist(id: string): Promise<void> {
    const count = await this.prisma.inventory.count({ where: { id } });

    if (count && count > 0) {
      throw new InventoryAlreadyExistError();
    }
  }

  async assertExist(id: string): Promise<void> {
    const count = await this.prisma.inventory.count({ where: { id } });

    if (!count || count === 0) {
      throw new InventoryNotExistError();
    }
  }

  async assertExistAndBelongEvent(id: string, eventId: string): Promise<void> {
    const inventory = await this.prisma.inventory.findFirst({ where: { id } });

    if (!inventory) {
      throw new InventoryNotExistError();
    }

    if (inventory.eventId !== eventId) {
      throw new InventoryNotBelongEventError();
    }
  }

  async getById(id: string): Promise<Inventory> {
    const inventory = await this.prisma.inventory.findFirst({
      where: { id }
    });

    if (!inventory) {
      throw new InventoryNotExistError();
    }

    return inventory;
  }

  async create(data: InventoryCreateData): Promise<Inventory> {
    const inventory = await this.prisma.inventory.create({ data });

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
