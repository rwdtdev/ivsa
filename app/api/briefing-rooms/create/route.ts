import { NextRequest, NextResponse } from 'next/server';
import { getErrorResponse } from '@/lib/helpers';
import { CreateBriefingRoomBodySchema } from './validation';

import { IvaService } from '@/core/iva/IvaService';
import { EventService } from '@/core/event/EventService';
import { BriefingRoomManager } from '@/core/briefing-room/BriefingRoomManager';
import { assertAPICallIsAuthorized } from '@/lib/api/helpers';

export async function POST(request: NextRequest) {
  let conferenceSessionId;

  const briefingRoomManager = new BriefingRoomManager(
    new IvaService(),
    new EventService()
  );

  try {
    assertAPICallIsAuthorized(request);
    
    const response = await briefingRoomManager.createRoom(
      CreateBriefingRoomBodySchema.parse(await request.json())
    );

    conferenceSessionId = response.briefingId;

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (conferenceSessionId) {
      await briefingRoomManager.closeConference(conferenceSessionId);
    }

    return getErrorResponse(error);
  }
}
