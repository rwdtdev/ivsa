import { NextRequest } from 'next/server';
import { getErrorResponse } from '@/lib/helpers';
import { PathParamsSchema, QueryParamsSchema } from './validation';
import { ParticipantService } from '@/core/participant/ParticipantService';
import { InventoryService } from '@/core/inventory/InventoryService';

interface IContext {
  params: { inventoryId: string };
}

export async function PUT(req: NextRequest, context: IContext) {
  const participantService = new ParticipantService();
  const inventoryService = new InventoryService();

  try {
    const { inventoryId } = PathParamsSchema.parse(context.params);
    const { searchParams } = new URL(req.url);

    const { eventId } = QueryParamsSchema.parse({
      eventId: searchParams.get('eventId') ?? undefined
    });

    await inventoryService.assertExistAndBelongEvent(inventoryId, eventId);
    await participantService.removeInventoryParticipants(inventoryId, eventId);

    return new Response(null, { status: 204 });
  } catch (error) {
    return getErrorResponse(error, req);
  }
}
