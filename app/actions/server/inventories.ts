'use server';

import { InventoryService } from '@/core/inventory/InventoryService';
import prisma from '@/core/prisma';
import { Inventory, InventoryResource, ResourceProcessStatus } from '@prisma/client';

export type InventoryResourceWithAddress = InventoryResource & { address: string };
export type InventoryWithResources = Inventory & {
  resources: InventoryResourceWithAddress[];
};

export const updateInventoryAddress = async (id: string, address: string | null) => {
  const inventoryService = new InventoryService();

  try {
    return await inventoryService.update(id, { address });
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getInventoryByIdAction = async (
  id: string
  // eventId: string
): Promise<InventoryWithResources | null> => {
  try {
    // const inventoryService = new InventoryService();
    // return await inventoryService.getByIdAndEventId(id, eventId);

    const inventoryResources = await prisma.inventory.findFirst({
      where: { id },
      include: {
        resources: {
          where: { status: ResourceProcessStatus.PROCESSED }
        }
      }
    });

    if (!inventoryResources) return null;

    const resourcesWithAddress = await Promise.all(
      inventoryResources.resources.map(async (resource) => {
        // const location = await prisma.inventoryLocation.findFirst({
        //   where: { resourceId: resource.id }
        // });
        // const address = location?.address || 'адрес не указан';
        const address = inventoryResources.address || 'адрес не указан';
        return { ...resource, address };
      })
    );

    return { ...inventoryResources, resources: resourcesWithAddress };
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const setInventoryVideographer = async (id: string, videographerId: string) => {
  const inventoryService = new InventoryService();

  return await inventoryService.update(id, { videographerId });
};

export const setInventoryInspector = async (id: string, inspectorId: string) => {
  const inventoryService = new InventoryService();

  return await inventoryService.update(id, { inspectorId });
};
