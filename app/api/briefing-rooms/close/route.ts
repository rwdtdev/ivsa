import { NextRequest } from 'next/server';
import { getErrorResponse } from '@/lib/helpers';
import { CloseBriefingRoomBodySchema } from './validation';

import { IvaService } from '@/core/iva/IvaService';
import { EventService } from '@/core/event/EventService';
import { BriefingRoomManager } from '@/core/briefing-room/BriefingRoomManager';
import { assertAPICallIsAuthorized } from '@/lib/api/helpers';

export async function PUT(request: NextRequest) {
  const briefingRoomManager = new BriefingRoomManager(
    new IvaService(),
    new EventService()
  );

  try {
    assertAPICallIsAuthorized(request);

    await briefingRoomManager.closeRoom(
      CloseBriefingRoomBodySchema.parse(await request.json())
    );

    return new Response(null, { status: 204 });
  } catch (error) {
    return getErrorResponse(error);
  }
}
