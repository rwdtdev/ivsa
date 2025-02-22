import { getErrorResponse } from '@/lib/helpers';
import { NextRequest, NextResponse } from 'next/server';
import { PathParamsSchema, UpdateInventorySchema } from './validation';
import { InventoryService } from '@/core/inventory/InventoryService';
import { ParticipantService } from '@/core/participant/ParticipantService';
import { ParticipantManager } from '@/core/participant/ParticipantManager';
import { EventService } from '@/core/event/EventService';

interface IContext {
  params: { inventoryId: string };
}

export async function PUT(req: NextRequest, context: IContext) {
  const participantManager = new ParticipantManager(
    new EventService(),
    new InventoryService(),
    new ParticipantService()
  );

  try {
    const { inventoryId } = PathParamsSchema.parse(context.params);

    const response = await participantManager.createInventoryParticipants(
      inventoryId,
      UpdateInventorySchema.parse(await req.json())
    );

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return getErrorResponse(error, req);
  }
}
