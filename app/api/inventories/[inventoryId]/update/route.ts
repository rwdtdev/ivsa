import { NextRequest, NextResponse } from 'next/server';
import { makeResponseCORSLess } from '@/lib/api/helpers';
import { InventoryService } from '@/core/inventory/InventoryService';
import { InventoryObjectService } from '@/core/inventory-object/InventoryObjectService';
import { InventoryManager } from '@/core/inventory/InventoryManager';
import { getErrorResponse } from '@/lib/helpers';

interface iContext {
  params: {
    inventoryId: string;
  };
}

export async function POST(request: NextRequest, context: iContext) {
  const reqBody = await request.json();
  const { inventoryId } = context.params;
  const eventId = reqBody.eventId;

  const inventoryManager = new InventoryManager(new InventoryService(), new InventoryObjectService());

  try {
    await inventoryManager.updateInventory(eventId, inventoryId, reqBody);

    const resp: NextResponse = new NextResponse(undefined, { status: 204 });

    return makeResponseCORSLess(resp);
  } catch (err: any) {

    return getErrorResponse(err);
  }
}
