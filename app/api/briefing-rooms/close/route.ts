import { NextRequest } from 'next/server';
import { getErrorResponse, getUnknownErrorText } from '@/lib/helpers';
import { CloseBriefingRoomBodySchema } from './validation';

import { IvaService } from '@/core/iva/IvaService';
import { EventService } from '@/core/event/EventService';
import { BriefingRoomManager } from '@/core/briefing-room/BriefingRoomManager';
import { getClientIP } from '@/lib/helpers/ip';
import { ActionService } from '@/core/action/ActionService';
import { ActionStatus } from '@prisma/client';

export async function PUT(req: NextRequest) {
  const ip = getClientIP(req);
  const actionService = new ActionService();
  const briefingRoomManager = new BriefingRoomManager(
    new IvaService(),
    new EventService()
  );

  let params;

  try {
    params = CloseBriefingRoomBodySchema.parse(await req.json());

    await briefingRoomManager.closeRoom(params);
    await actionService.addCloseBriefingRoomActionLog(ip, ActionStatus.SUCCESS, {
      eventId: params.eventId
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    await actionService.addCloseBriefingRoomActionLog(ip, ActionStatus.ERROR, {
      error: getUnknownErrorText(error),
      eventId: params?.eventId
    });

    return getErrorResponse(error, req);
  }
}
