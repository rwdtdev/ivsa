import { NextRequest } from 'next/server';
import { InventoryService } from '@/core/inventory/InventoryService';
import { InventoryObjectService } from '@/core/inventory-object/InventoryObjectService';
import { InventoryManager } from '@/core/inventory/InventoryManager';
import { getErrorResponse } from '@/lib/helpers';
import { UpdateInventoryPathParamsSchema, UpdateInventorySchema } from './validation';
import { InventoryLocationService } from '@/core/inventory-location/InventoryLocationService';

interface IContext {
  params: { inventoryId: string };
}

export async function POST(req: NextRequest, context: IContext) {
  const inventoryManager = new InventoryManager(
    new InventoryService(),
    new InventoryObjectService(),
    new InventoryLocationService()
  );

  try {
    const data = UpdateInventorySchema.parse(await req.json());
    const { inventoryId } = UpdateInventoryPathParamsSchema.parse(context.params);

    await inventoryManager.updateInventory(inventoryId, data);

    return new Response(null, { status: 204 });
  } catch (error) {
    return getErrorResponse(error, req);
  }
}
