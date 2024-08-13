import { NextRequest, NextResponse } from 'next/server';
import { getErrorResponse, getUnknownErrorText } from '@/lib/helpers';
import { CreateBriefingRoomBodySchema } from './validation';

import { IvaService } from '@/core/iva/IvaService';
import { EventService } from '@/core/event/EventService';
import { BriefingRoomManager } from '@/core/briefing-room/BriefingRoomManager';
import { getClientIP } from '@/lib/helpers/ip';
import { ActionService } from '@/core/action/ActionService';
import { ActionStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  const ip = getClientIP(req.headers);
  const actionService = new ActionService();
  const briefingRoomManager = new BriefingRoomManager(
    new IvaService(),
    new EventService()
  );

  let params;
  let conferenceSessionId;

  try {
    params = CreateBriefingRoomBodySchema.parse(await req.json());

    const response = await briefingRoomManager.createRoom(params);

    conferenceSessionId = response.briefingId;

    await actionService.addOpenBriefingRoomActionLog(ip, ActionStatus.SUCCESS, {
      eventId: params.eventId,
      conferenceId: conferenceSessionId
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (conferenceSessionId) {
      await briefingRoomManager.closeConference(conferenceSessionId);
    }

    await actionService.addOpenBriefingRoomActionLog(ip, ActionStatus.ERROR, {
      error: getUnknownErrorText(error),
      eventId: params?.eventId,
      conferenceId: conferenceSessionId
    });

    return getErrorResponse(error, req);
  }
}
