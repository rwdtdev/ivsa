import { NextRequest } from 'next/server';
import { InventoryService } from '@/core/inventory/InventoryService';
import { getErrorResponse } from '@/lib/helpers';
import { PathParamsSchema, QueryParamsSchema } from './validation';
import { assertAPICallIsAuthorized } from '@/lib/api/helpers';

interface IContext {
  params: { inventoryId: string };
}

export async function DELETE(request: NextRequest, context: IContext) {
  const inventoryService = new InventoryService();

  try {
    assertAPICallIsAuthorized(request);
    
    const { inventoryId } = PathParamsSchema.parse(context.params);
    const { searchParams } = new URL(request.url);
    const { eventId } = QueryParamsSchema.parse({
      eventId: searchParams.get('eventId') ?? undefined
    });

    await inventoryService.assertExistAndBelongEvent(inventoryId, eventId);
    await inventoryService.removeLogical(inventoryId);

    return new Response(null, { status: 204 });
  } catch (error) {
    return getErrorResponse(error);
  }
}
