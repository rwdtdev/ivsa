import { Inventory, InventoryStatus } from "@prisma/client";
import { InventoryObjectService } from "../inventory-object/InventoryObjectService";
import { InventoryService } from "./InventoryService";
import { InventoryCodes } from "./types";
import { mapToInventoryObject } from "./mappers/InventoryObjectsMapper";
import { EventService } from "../event/EventService";

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

  async updateInventory(eventId: string, inventoryId: string, reqBody: InventoryUpdateRequestBody) {
    const newOrOld = <T>(bodyPropName: string, inventoryPropName: string): T => (reqBody[bodyPropName as keyof InventoryUpdateRequestBody] ?? currentInventory[inventoryPropName as keyof Inventory]) as T;

    await this.inventoryService.assertExistAndBelongEvent(inventoryId, eventId);

    const currentInventory = await this.inventoryService.getById(inventoryId);

    const newInventoryData = {
      eventId: newOrOld<string>('eventId', 'eventId'),
      number: newOrOld<string>('inventoryNumber', 'number'),
      code: newOrOld<string>('inventoryCode', 'code'),
      shortName: InventoryCodes[ newOrOld('inventoryCode', 'code') as keyof typeof InventoryCodes ].shortName,
      name: InventoryCodes[ newOrOld('inventoryCode', 'code') as keyof typeof InventoryCodes ].name,
      date: newOrOld<Date>('inventoryDate', 'date'),
      status: newOrOld<InventoryStatus>('inventoryStatus', 'status'),
      parentId: newOrOld<string>('inventoryParentId', 'parentId')
    };

    const updatedInventory = await this.inventoryService.update(inventoryId, newInventoryData);

    if (Boolean(reqBody.inventoryObjects)) {
      const intentoryObjectPromises = reqBody.inventoryObjects!.map(async (object: any) =>
        this.inventoryObjectService.update({
          ...mapToInventoryObject(newOrOld('inventoryCode', 'code'), object),
          inventoryId: inventoryId,
        })
      );
      
      await Promise.all(intentoryObjectPromises);
    }
    return updatedInventory;
  }
}
