import { NextRequest } from 'next/server';
import { InventoryService } from '@/core/inventory/InventoryService';
import { InventoryObjectService } from '@/core/inventory-object/InventoryObjectService';
import { InventoryManager } from '@/core/inventory/InventoryManager';
import { getErrorResponse } from '@/lib/helpers';
import { UpdateInventoryPathParamsSchema, UpdateInventorySchema } from './validation';

interface IContext {
  params: { inventoryId: string };
}

export async function POST(request: NextRequest, context: IContext) {
  const inventoryManager = new InventoryManager(
    new InventoryService(),
    new InventoryObjectService()
  );

  try {
    const data = UpdateInventorySchema.parse(await request.json());
    const { inventoryId } = UpdateInventoryPathParamsSchema.parse(context.params);

    await inventoryManager.updateInventory(inventoryId, data);

    return new Response(null, { status: 204 });
  } catch (error) {
    return getErrorResponse(error);
  }
}
