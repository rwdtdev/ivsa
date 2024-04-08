import { NextRequest } from 'next/server';
import { getErrorResponse } from '@/lib/helpers';
import { ParticipantsSchema, UpdateEventPathParamsSchema } from '../validation';

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

    await eventManager.updateEventParticipants(
      eventId,
      ParticipantsSchema.parse(await req.json())
    );

    return new Response(null, { status: 204 });
  } catch (error) {
    return getErrorResponse(error, req);
  }
}
