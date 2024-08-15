'use server';

import { InventoryLocationService } from '@/core/inventory-location/InventoryLocationService';
import { InventoryObjectService } from '@/core/inventory-object/InventoryObjectService';
import { InventoryManager } from '@/core/inventory/InventoryManager';
import { InventoryService } from '@/core/inventory/InventoryService';

export async function getInventoryLocationsStatsAction(inventoryId: string) {
  const inventoryManager = new InventoryManager(
    new InventoryService(),
    new InventoryObjectService(),
    new InventoryLocationService()
  );

  try {
    const stats = await inventoryManager.getInventoryLocationsStats(inventoryId);

    return stats;
  } catch (err) {
    return null;
  }
}
