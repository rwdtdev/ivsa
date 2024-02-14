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

export async function PUT(request: NextRequest, context: iContext) {
    const CONSOLE_LOG_PREFIX = generateConsoleLogPrefix(request.method, '/api/inventories/[inventoryId]/participants/delete-all');
    const clog = (textToLog: string, ...args: any) => console.log(`${CONSOLE_LOG_PREFIX}${textToLog}`, ...args);

    const { inventoryId } = context.params;
    
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

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

    if (!!eventId && !validateEventId(eventId)) {
      resp = NextResponse.json({
        "type": "urn:problem-type:unprocessable-content",
        "title": "Необрабатываемый контент",
        "detail": `Событие с eventId ${eventId} не найдено`,
        "status": 422,
      }, {
        status: 422
      });
    }

    clog(`eventId: ${eventId}\ninventoryId: ${inventoryId}\nresponding with status ${resp.status}, '${resp.statusText}'`)

    return makeResponseCORSLess(resp);
}
