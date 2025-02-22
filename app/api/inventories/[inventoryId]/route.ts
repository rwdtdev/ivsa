import { NextRequest, NextResponse } from 'next/server';
import { InventoryService } from '@/core/inventory/InventoryService';
import { getErrorResponse } from '@/lib/helpers';
import { PathParamsSchema, QueryParamsSchema } from './validation';

interface IContext {
  params: { inventoryId: string };
}

export async function DELETE(req: NextRequest, context: IContext) {
  const inventoryService = new InventoryService();

  try {
    const { inventoryId } = PathParamsSchema.parse(context.params);
    const { searchParams } = new URL(req.url);
    const { eventId } = QueryParamsSchema.parse({
      eventId: searchParams.get('eventId') ?? undefined
    });

    await inventoryService.assertExistAndBelongEvent(inventoryId, eventId);
    await inventoryService.removeLogical(inventoryId);

    return new Response(null, { status: 204 });
  } catch (error) {
    return getErrorResponse(error, req);
  }
}

export async function GET(req: NextRequest, context: IContext) {
  const inventoryService = new InventoryService();

  try {
    const { inventoryId } = PathParamsSchema.parse(context.params);

    const inventory = await inventoryService.getById(inventoryId)

    return NextResponse.json(inventory);
  } catch (error) {
    return getErrorResponse(error, req);
  }
}