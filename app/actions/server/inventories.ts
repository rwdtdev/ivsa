'use server';

import { InventoryService } from '@/core/inventory/InventoryService';
import { InventoryWithObjects } from '@/core/inventory/types';

export const getInventoryByIdAction = async (
  id: string,
  eventId: string
): Promise<InventoryWithObjects | null> => {
  try {
    const inventoryService = new InventoryService();

    return await inventoryService.getByIdAndEventId(id, eventId);
  } catch (err) {
    console.error(err);
    return null;
  }
};
