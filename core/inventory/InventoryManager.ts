import { Inventory, InventoryStatus } from '@prisma/client';
import { InventoryObjectService } from '../inventory-object/InventoryObjectService';
import { InventoryService } from './InventoryService';
import { InventoryCodes } from './types';
import { mapToInventoryObject } from './mappers/InventoryObjectsMapper';
import { doTransaction } from '@/lib/prisma-transaction';
import { TransactionSession } from '@/types/prisma';
import { UpdateInventoryData } from '@/app/api/inventories/[inventoryId]/update/validation';
import { CreateIndividualInventoryData } from '@/app/api/inventories/[inventoryId]/individual-inventory/validation';

export interface InventoryUpdateRequestBody {
  eventId: string;
  inventoryNumber?: string;
  inventoryCode?: string;
  inventoryDate?: Date;
  inventoryStatus?: InventoryStatus;
  inventoryParentId?: string;
  inventoryObjects?: object[];
}

export class InventoryManager {
  private inventoryService: InventoryService;
  private inventoryObjectService: InventoryObjectService;

  constructor(
    inventoryService: InventoryService,
    inventoryObjectService: InventoryObjectService
  ) {
    this.inventoryService = inventoryService;
    this.inventoryObjectService = inventoryObjectService;
  }

  async createIndividual({ inventoryObjects, ...data }: CreateIndividualInventoryData) {
    await doTransaction(async (session: TransactionSession) => {
      const inventoryService = this.inventoryService.withSession(session);
      const inventoryObjectService = this.inventoryObjectService.withSession(session);

      await inventoryService.assertExistAndBelongEvent(data.id, data.eventId);
      await inventoryService.assertNotExistWithEvent(
        data.complexInventoryId,
        data.eventId
      );

      const inventory = await inventoryService.create({
        eventId: data.eventId,
        id: data.complexInventoryId,
        parentId: data.id,
        code: data.inventoryCode,
        name: InventoryCodes[data.inventoryCode].name,
        shortName: InventoryCodes[data.inventoryCode].shortName,
        number: data.inventoryNumber,
        date: new Date(data.inventoryDate)
      });

      if (inventoryObjects && inventory) {
        const intentoryObjectPromises = inventoryObjects!.map(async (object: any) =>
          inventoryObjectService.create({
            ...mapToInventoryObject(data.inventoryCode, object),
            inventoryId: inventory.id
          })
        );

        await Promise.all(intentoryObjectPromises);
      }
    });
  }

  async removeIndividual(id: string, complexInventoryId: string, eventId: string) {
    await doTransaction(async (session: TransactionSession) => {
      const inventoryService = this.inventoryService.withSession(session);
      const inventoryObjectService = this.inventoryObjectService.withSession(session);

      await inventoryService.assertExistAndBelongEvent(complexInventoryId, eventId);
      await inventoryService.assertExistAndBelongEvent(id, eventId);
      await inventoryService.assertIsParent(complexInventoryId, id);

      await inventoryObjectService.removeByInventoryId(id);
      await inventoryService.remove(id, eventId);
    });
  }

  async updateInventory(inventoryId: string, { eventId, ...data }: UpdateInventoryData) {
    await doTransaction(async (session: TransactionSession) => {
      const newOrOld = <T>(bodyPropName: string, inventoryPropName: string): T =>
        (data[bodyPropName as keyof Omit<UpdateInventoryData, 'eventId'>] ??
          inventory[inventoryPropName as keyof Inventory]) as T;

      const inventoryService = this.inventoryService.withSession(session);
      const inventoryObjectService = this.inventoryObjectService.withSession(session);

      await inventoryService.assertExistAndBelongEvent(inventoryId, eventId);

      const inventory = await inventoryService.getById(inventoryId);

      await inventoryService.update(inventoryId, {
        eventId: newOrOld<string>('eventId', 'eventId'),
        number: newOrOld<string>('inventoryNumber', 'number'),
        code: newOrOld<string>('inventoryCode', 'code'),
        shortName:
          InventoryCodes[newOrOld('inventoryCode', 'code') as keyof typeof InventoryCodes]
            .shortName,
        name: InventoryCodes[
          newOrOld('inventoryCode', 'code') as keyof typeof InventoryCodes
        ].name,
        date: newOrOld<Date>('inventoryDate', 'date'),
        status: newOrOld<InventoryStatus>('inventoryStatus', 'status'),
        parentId: newOrOld<string>('inventoryParentId', 'parentId')
      });

      if (!data.inventoryObjects) return;

      const intentoryObjectPromises = data.inventoryObjects!.map(async (object: any) =>
        inventoryObjectService.update({
          ...mapToInventoryObject(newOrOld('inventoryCode', 'code'), object),
          inventoryId
        })
      );

      await Promise.all(intentoryObjectPromises);
    });
  }
}
