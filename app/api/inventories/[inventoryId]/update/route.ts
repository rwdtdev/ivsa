import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/server/services/prisma';
import {
    makeResponseCORSLess, validateEventId, validateInventoryId,
} from '@/lib/api/helpers';
import {
    generateConsoleLogPrefix,
} from '@/lib/api/ansi-helpers';

interface iContext {
    params: {
    inventoryId: string,
  };
}

export async function POST(request: NextRequest, context: iContext) {
    const CONSOLE_LOG_PREFIX = generateConsoleLogPrefix(request.method, '/api/inventories/[inventoryId]/update');
    const clog = (textToLog: string, ...args: any) => console.log(`${CONSOLE_LOG_PREFIX}${textToLog}`, ...args);

    const { inventoryId } = context.params;
    const reqBody = await request.json();
    const eventId = reqBody.eventId;

    // Placeholder response
    let resp: NextResponse = new NextResponse(undefined, { status: 204 });

    if (!validateInventoryId(inventoryId)) {
      resp = NextResponse.json({
        "type": "urn:problem-type:unprocessable-content",
        "title": "Необрабатываемый контент",
        "detail": `Опись с inventoryId ${inventoryId} не найдена`,
        "status": 404,
      }, {
        status: 404
      });
    }

    if (!validateEventId(eventId)) {
      resp = NextResponse.json({
        "type": "urn:problem-type:unprocessable-content",
        "title": "Необрабатываемый контент",
        "detail": `Событие с eventId ${eventId} не найдено`,
        "status": 422,
      }, {
        status: 422
      });
    }

    clog(`eventId is ${validateEventId(eventId) ? 'valid' : 'invalid'}\nrequest body: %O\nresponding with status ${resp.status}, '${resp.statusText}'`, reqBody)
    
    return makeResponseCORSLess(resp);
}
