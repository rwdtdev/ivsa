import { NextRequest, NextResponse } from 'next/server';
import { getErrorResponse, getUnknownErrorText } from '@/lib/helpers';
import { CreateEventSchema } from './validation';
import { EventService } from '@/core/event/EventService';
import { EventManager } from '@/core/event/EventManager';
import { ParticipantService } from '@/core/participant/ParticipantService';
import { UserService } from '@/core/user/UserService';
import { getClientIP } from '@/lib/helpers/ip';
import { ActionService } from '@/core/action/ActionService';
import { ActionStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  const ip = getClientIP(req);

  const actionService = new ActionService();
  const eventManager = new EventManager(
    new EventService(),
    new ParticipantService(),
    new UserService()
  );

  let params;

  try {
    params = CreateEventSchema.parse(await req.json());

    const response = await eventManager.createEvent(params);

    await actionService.addCreateEventActionLog(ip, ActionStatus.SUCCESS, {
      eventId: response.eventId,
      orderNumber: params.orderNumber,
      orderDate: params.orderDate,
      orderId: params.orderId
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    await actionService.addCreateEventActionLog(ip, ActionStatus.ERROR, {
      error: getUnknownErrorText(error),
      orderNumber: params?.orderNumber,
      orderDate: params?.orderDate,
      orderId: params?.orderId
    });

    return getErrorResponse(error, req);
  }
}
