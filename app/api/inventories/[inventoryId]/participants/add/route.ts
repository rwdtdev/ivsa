import { getErrorResponse } from '@/lib/helpers';
import { NextRequest, NextResponse } from 'next/server';
import { PathParamsSchema, UpdateInventorySchema } from './validation';
import { InventoryService } from '@/core/inventory/InventoryService';
import { ParticipantService } from '@/core/participant/ParticipantService';
import { assertAPICallIsAuthorized } from '@/lib/api/helpers';
import { ParticipantManager } from '@/core/participant/ParticipantManager';
import { EventService } from '@/core/event/EventService';

interface IContext {
  params: { inventoryId: string };
}

export async function PUT(request: NextRequest, context: IContext) {
  const participantManager = new ParticipantManager(
    new EventService(),
    new InventoryService(),
    new ParticipantService()
  );

  try {
    assertAPICallIsAuthorized(request);

    const { inventoryId } = PathParamsSchema.parse(context.params);

    const response = await participantManager.createInventoryParticipants(
      inventoryId,
      UpdateInventorySchema.parse(await request.json())
    );

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return getErrorResponse(error);
  }
}
