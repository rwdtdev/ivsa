import { NextRequest } from 'next/server';
import { getErrorResponse } from '@/lib/helpers';
import { CloseBriefingRoomBodySchema } from './validation';

import { IvaService } from '@/core/iva/IvaService';
import { EventService } from '@/core/event/EventService';
import { BriefingRoomManager } from '@/core/briefing-room/BriefingRoomManager';

export async function PUT(req: NextRequest) {
  const briefingRoomManager = new BriefingRoomManager(
    new IvaService(),
    new EventService()
  );

  try {
    await briefingRoomManager.closeRoom(
      CloseBriefingRoomBodySchema.parse(await req.json())
    );

    return new Response(null, { status: 204 });
  } catch (error) {
    return getErrorResponse(error, req);
  }
}
