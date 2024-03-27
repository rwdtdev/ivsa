import { NextRequest, NextResponse } from 'next/server';
import { getErrorResponse } from '@/lib/helpers';
import { GetEventPortalLinkPathParamsSchema } from './validation';
import { EventService } from '@/core/event/EventService';
import { assertAPICallIsAuthorized } from '@/lib/api/helpers';

interface IContext {
  params: { eventId: string };
}

export async function GET(request: NextRequest, context: IContext) {
  const eventService = new EventService();

  try {
    assertAPICallIsAuthorized(request);

    const { eventId } = GetEventPortalLinkPathParamsSchema.parse(context.params);

    await eventService.assertExist(eventId);

    return NextResponse.json(
      { portalLink: `${process.env.NEXTAUTH_URL}/admin/events/${eventId}` },
      { status: 200, statusText: 'OK' }
    );
  } catch (error) {
    return getErrorResponse(error);
  }
}
