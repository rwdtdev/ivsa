import { getErrorResponse } from '@/lib/helpers';
import { NextRequest } from 'next/server';
import { CreateInventoryLocationSchema, PathParamsSchema } from './validation';
import { InventoryService } from '@/core/inventory/InventoryService';
import { InventoryManager } from '@/core/inventory/InventoryManager';
import { InventoryObjectService } from '@/core/inventory-object/InventoryObjectService';
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
    const { inventoryId } = PathParamsSchema.parse(context.params);

    const data = CreateInventoryLocationSchema.parse(await req.json());

    await inventoryManager.createInventoryLocation({
      inventoryId,
      latitude: data.latitude,
      longitude: data.longitude,
      accuracy: data.accuracy,
      dateTime: new Date(data.dateTime)
    });

    return new Response(null, { status: 201 });
  } catch (error) {
    return getErrorResponse(error, req);
  }
}
