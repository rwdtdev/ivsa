import { NextRequest, NextResponse } from 'next/server';
import {
  checkEventId,
  genClog,
  makeResponseCORSLess,
} from '@/lib/api/helpers';
import {
  b,
  cn,
  generateConsoleLogPrefix,
} from '@/lib/api/ansi-helpers';
import { EventService } from '@/server/services/events';
import { EventStatus } from '@prisma/client';

interface iContext {
  params: {
    eventId: string,
  };
}

export async function PUT(request: NextRequest, context: iContext) {
    const CONSOLE_LOG_PREFIX = generateConsoleLogPrefix(request.method, '/api/events/[eventId]');
    const clog = (textToLog: string, ...args: any) => console.log(`${CONSOLE_LOG_PREFIX}${textToLog}`, ...args);

    const reqBody = await request.json();

    const { eventId } = context.params;

    const eventService = new EventService();

    const eventIdErrorResponse = await checkEventId(clog, eventService, eventId);

    if (eventIdErrorResponse !== undefined) {
      return eventIdErrorResponse;
    }
  
    //...validate body supplied data here...

    await eventService.update(eventId, {
      ...reqBody, //<=== currently unvalidated!!
    });
  /*
  type Event = {
    //id: string;
    commandId: string;
    commandNumber: string;
    commandDate: Date;
    orderId: string;
    orderNumber: string;
    orderDate: Date;
    startAt: Date;
    endAt: Date;
    balanceUnit: string;
    balanceUnitRegionCode: string;
    status: $Enums.EventStatus;
    briefingStatus: $Enums.BriefingStatus;
    briefingRoomInviteLink: string | null;
    briefingSessionId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }
  */
    const resp: NextResponse = new NextResponse(undefined, { status: 204 });
  
    clog(`\n\teventId is ${b('valid').gr()} (${cn(eventId)})\n\tevent ${cn(eventId)} ${b('exists').gr()}\n\t\trequest body: %O\n\t\t${b('Responding with status ')}${resp.status}, '${resp.statusText}'\n`, reqBody);
    
    return makeResponseCORSLess(resp);
}

export async function DELETE(request: NextRequest, context: iContext) {
  const CONSOLE_LOG_PREFIX = generateConsoleLogPrefix(request.method, '/api/events/[eventId]');

  const clog = genClog(CONSOLE_LOG_PREFIX);
  
  const { eventId } = context.params;

  const eventService = new EventService();

  const eventIdErrorResponse = await checkEventId(clog, eventService, eventId);

  if (eventIdErrorResponse !== undefined) {
    return eventIdErrorResponse;
  }

  await eventService.update(eventId, {
    status: EventStatus.REMOVED,
  });

  const resp: NextResponse = new NextResponse(undefined, { status: 204 });

  clog(`\n\teventId is ${b('valid').gr()} (${cn(eventId)})\n\tevent ${cn(eventId)} ${b('exists').gr()}\n\t\t${b('Responding with status ')}${resp.status}, '${resp.statusText}'\n`);

  return makeResponseCORSLess(resp);
}
