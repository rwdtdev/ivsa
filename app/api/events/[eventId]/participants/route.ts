import { NextRequest } from 'next/server';
import { getErrorResponse, getUnknownErrorText } from '@/lib/helpers';
import { ParticipantsSchema, UpdateEventPathParamsSchema } from '../validation';

import { ParticipantService } from '@/core/participant/ParticipantService';
import { EventManager } from '@/core/event/EventManager';
import { EventService } from '@/core/event/EventService';
import { UserService } from '@/core/user/UserService';
import { getClientIP } from '@/lib/helpers/ip';
import { ActionService } from '@/core/action/ActionService';
import { ActionStatus } from '@prisma/client';

interface IContext {
  params: { eventId: string };
}

export async function PUT(req: NextRequest, context: IContext) {
  const ip = getClientIP(req.headers);
  const actionService = new ActionService();
  const eventManager = new EventManager(
    new EventService(),
    new ParticipantService(),
    new UserService()
  );

  let params;

  try {
    params = UpdateEventPathParamsSchema.parse(context.params);

    await eventManager.updateEventParticipants(
      params.eventId,
      ParticipantsSchema.parse(await req.json())
    );

    await actionService.addChangeEventParticipantsActionLog(ip, ActionStatus.SUCCESS, {
      eventId: params.eventId
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    await actionService.addChangeEventParticipantsActionLog(ip, ActionStatus.ERROR, {
      error: getUnknownErrorText(error),
      eventId: params?.eventId
    });

    return getErrorResponse(error, req);
  }
}
