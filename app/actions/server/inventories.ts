'use server';

import { InventoryService } from '@/core/inventory/InventoryService';
import { Inventory } from '@prisma/client';

export const getInventoryByIdAction = async (id: string): Promise<Inventory | null> => {
  try {
    const inventoryService = new InventoryService();

    return await inventoryService.getById(id);
  } catch (err) {
    console.error(err);
    return null;
  }
};
