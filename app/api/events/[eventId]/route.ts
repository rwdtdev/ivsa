import { NextRequest, NextResponse } from 'next/server';
import { getErrorResponse } from '@/lib/helpers';
import {
  RemoveEventPathParamsSchema,
  UpdateEventPathParamsSchema,
  UpdateEventSchema
} from './validation';

import { ParticipantService } from '@/core/participant/ParticipantService';
import { EventManager } from '@/core/event/EventManager';
import { EventService } from '@/core/event/EventService';
import { UserService } from '@/core/user/UserService';

interface IContext {
  params: { eventId: string };
}

export async function PUT(req: NextRequest, context: IContext) {
  const eventManager = new EventManager(
    new EventService(),
    new ParticipantService(),
    new UserService()
  );

  try {
    const { eventId } = UpdateEventPathParamsSchema.parse(context.params);

    const response = await eventManager.updateEvent(
      eventId,
      UpdateEventSchema.parse(await req.json())
    );

    return NextResponse.json(response, { status: 200, statusText: 'OK' });
  } catch (error) {
    return getErrorResponse(error, req);
  }
}

export async function DELETE(req: NextRequest, context: IContext) {
  const eventManager = new EventManager(
    new EventService(),
    new ParticipantService(),
    new UserService()
  );

  try {
    const { eventId } = RemoveEventPathParamsSchema.parse(context.params);

    await eventManager.removeEventLogical(eventId);

    return new Response(null, { status: 204 });
  } catch (error) {
    return getErrorResponse(error, req);
  }
}
