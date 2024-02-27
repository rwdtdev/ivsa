import { doTransaction } from '@/lib/prisma-transaction';
import { EventService } from '@/server/services/events';
import { TransactionSession } from '@/types/prisma';
import { NextRequest } from 'next/server';
import IvaAPI from '@/server/services/iva/api';
import { BriefingStatus } from '@prisma/client';
import { getErrorResponse } from '@/lib/helpers';
import { BriefingRoomIsNotOpened } from './errors';

export async function PUT(request: NextRequest) {
  const reqBody = await request.json();
  const eventId = reqBody.eventId;

  try {
    return await doTransaction(async (txSession: TransactionSession) => {
      const eventServiceWithSession = EventService.withSession(txSession);

      await eventServiceWithSession.assertExist(eventId);

      const event = await eventServiceWithSession.getEventById(eventId);

      if (!event.briefingSessionId) {
        throw new BriefingRoomIsNotOpened();
      }

      await IvaAPI.conferenceSessions.closeRoom(event.briefingSessionId);

      await eventServiceWithSession.update(eventId, {
        briefingStatus: BriefingStatus.PASSED,
        briefingRoomInviteLink: null,
        briefingSessionId: null
      });

      return new Response(null, { status: 204 });
    });
  } catch (error) {
    return getErrorResponse(error);
  }
}
