'use server';

import { InventoryService } from '@/core/inventory/InventoryService';

export async function getInventoryById(inventoryId: string) {
  const inventoryService = new InventoryService();
  try {
    const inventory = await inventoryService.getById(inventoryId);
    return inventory;
  } catch (err) {
    return null;
  }
}
