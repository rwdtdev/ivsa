import { NextRequest } from 'next/server';
import { getErrorResponse } from '@/lib/helpers';
import {
  RemoveEventPathParamsSchema,
  UpdateEventPathParamsSchema,
  UpdateEventSchema
} from './validation';

import { ParticipantService } from '@/core/participant/ParticipantService';
import { EventManager } from '@/core/event/EventManager';
import { EventService } from '@/core/event/EventService';

interface IContext {
  params: { eventId: string };
}

export async function PUT(request: NextRequest, context: IContext) {
  const eventManager = new EventManager(new EventService(), new ParticipantService());

  try {
    const { eventId } = UpdateEventPathParamsSchema.parse(context.params);

    await eventManager.updateEvent(
      eventId,
      UpdateEventSchema.parse(await request.json())
    );

    return new Response(null, { status: 204 });
  } catch (error) {
    return getErrorResponse(error);
  }
}

export async function DELETE(_: NextRequest, context: IContext) {
  const eventManager = new EventManager(new EventService(), new ParticipantService());

  try {
    const { eventId } = RemoveEventPathParamsSchema.parse(context.params);

    await eventManager.removeEventLogical(eventId);

    return new Response(null, { status: 204 });
  } catch (error) {
    return getErrorResponse(error);
  }
}
