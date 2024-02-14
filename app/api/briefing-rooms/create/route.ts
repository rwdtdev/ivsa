import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/server/services/prisma';
import {
    makeResponseCORSLess, validateEventId, zodValidateEventId,
} from '@/lib/api/helpers';
import {
  cn, gr, rd, yl,
  generateConsoleLogPrefix,
  validityState,
  mg,
} from '@/lib/api/ansi-helpers';

export async function POST(request: NextRequest) {
    const CONSOLE_LOG_PREFIX = generateConsoleLogPrefix(request.method, '/api/briefing-rooms/create');
    const clog = (textToLog: string, ...args: any) => console.log(`${CONSOLE_LOG_PREFIX}${textToLog}`, ...args);

    const reqBody = await request.json();
    const eventId = reqBody.eventId;

    // Placeholder response
    let resp: NextResponse = NextResponse.json({
      "briefingId": "049fc113-4408-4d97-b9e8-fef7a6cb5ae4",
      "briefingLink": "https://www.ourdomain.ru/049fc113-4408-4d97-b9e8-fef7a6cb5ae4"
    }, {
      status: 201,
      statusText: 'Created',
    });

    //console.log(`${yl('Zod').b()} validаte for EventId '${cn(eventId)}': %O`, zodValidateEventId(eventId))

    if (!validateEventId(eventId)) {
      resp = NextResponse.json({
        "type": "urn:problem-type:unprocessable-content",
        "title": "Необрабатываемый контент",
        "detail": `Неверный формат id события: ${eventId}`,
        "status": 422,
      }, {
        status: 422
      });
    }

    clog(`\n\t${validityState('eventId', validateEventId, eventId)}\n\trequest body: %O\n\tresponse status ${yl(resp.status.toString())}, '${yl(resp.statusText)}'\n`, reqBody);

    return makeResponseCORSLess(resp);
}
