import _ from 'underscore';
import { NextRequest, NextResponse } from 'next/server';
import { EventService } from '@/server/services/events';
import { getErrorResponse } from '@/lib/helpers';
import { getDateFromString } from '@/server/utils';

export async function POST(req: NextRequest) {
  const reqBody = await req.json();
  const eventService = new EventService();

  try {
    const event = await eventService.create(
      _.omit(
        {
          ...reqBody,
          startAt: getDateFromString(reqBody.auditStart),
          endAt: getDateFromString(reqBody.auditEnd),
          orderDate: getDateFromString(reqBody.orderDate),
          commandDate: getDateFromString(reqBody.commandDate)
        },
        'auditStart',
        'auditEnd'
      )
    );

    return NextResponse.json({ eventId: event.id }, { status: 201 });
  } catch (error) {
    return getErrorResponse(error);
  }
}
