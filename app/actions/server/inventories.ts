'use server';

import prisma from '@/core/prisma';
import { Inventory, InventoryResource } from '@prisma/client';

type InventoryResourceWithAddress = InventoryResource & { address: string };
type InventoryWithResources = Inventory & {
  resources: InventoryResourceWithAddress[];
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
      include: { resources: true }
    });

    if (!inventoryResources) return null;

    const resourcesWithAddress = await Promise.all(
      inventoryResources.resources.map(async (resource) => {
        const location = await prisma.inventoryLocation.findFirst({
          where: { resourceId: resource.id }
        });
        console.log('🚀 ~ inventoryResources.resources.map ~ location:', location);
        const address = location?.address || 'адрес не указан';
        return { ...resource, address };
      })
    );

    const locations = await prisma.inventoryLocation.findMany({
      where: { resourceId: inventoryResources?.resources[0].id }
    });
    console.log('🚀 ~ locations:', locations);

    return { ...inventoryResources, resources: resourcesWithAddress };
  } catch (err) {
    console.error(err);
    return null;
  }
};
