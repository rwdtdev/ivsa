import { NextRequest } from 'next/server';
import { getErrorResponse } from '@/lib/helpers';
import { PathParamsSchema, QueryParamsSchema } from './validation';
import { ParticipantService } from '@/core/participant/ParticipantService';
import { InventoryService } from '@/core/inventory/InventoryService';

interface IContext {
  params: { inventoryId: string };
}

export async function PUT(request: NextRequest, context: IContext) {
  const participantService = new ParticipantService();
  const inventoryService = new InventoryService();

  try {
    const { inventoryId } = PathParamsSchema.parse(context.params);
    const { searchParams } = new URL(request.url);
    const { eventId } = QueryParamsSchema.parse(searchParams.get('eventId'));

    await inventoryService.assertExistAndBelongEvent(inventoryId, eventId);
    await participantService.removeInventoryParticipants(inventoryId, eventId);

    return new Response(null, { status: 200, statusText: 'OK' });
  } catch (error) {
    return getErrorResponse(error);
  }
}
