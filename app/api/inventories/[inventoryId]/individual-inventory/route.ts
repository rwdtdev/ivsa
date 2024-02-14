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

export async function DELETE(request: NextRequest, context: iContext) {
  const CONSOLE_LOG_PREFIX = generateConsoleLogPrefix(request.method, '/api/inventories/[inventoryId]/individual-inventory');
  const clog = (textToLog: string, ...args: any) => console.log(`${CONSOLE_LOG_PREFIX}${textToLog}`, ...args);
  const { inventoryId } = context.params;
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId');
  const inventoryIdQ = searchParams.get('inventoryId');

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
      "detail": `Неверный формат id события: ${eventId}`,
      "status": 422,
    }, {
      status: 422
    });
  }

  if (!!inventoryIdQ && !validateInventoryId(inventoryIdQ)) {
    resp = NextResponse.json({
      "type": "urn:problem-type:unprocessable-content",
      "title": "Необрабатываемый контент",
      "detail": `Неверный формат id инвентаризации: ${inventoryId}`,
      "status": 422,
    }, {
      status: 422
    });
  }

  clog(`inventoryId(path): ${inventoryId}\ninventoryId (query): ${inventoryIdQ}\neventId: ${eventId}\nresponding with status ${resp.status}, '${resp.statusText}'`)

  return makeResponseCORSLess(resp);
}

export async function POST(request: NextRequest, context: iContext) {
  const CONSOLE_LOG_PREFIX = generateConsoleLogPrefix(request.method, '/api/inventories/[inventoryId]/individual-inventory');
  const clog = (textToLog: string, ...args: any) => console.log(`${CONSOLE_LOG_PREFIX}${textToLog}`, ...args);

  const reqBody = await request.json();
  const eventId = reqBody.eventId;
  const { inventoryId } = context.params;

  // Placeholder response
  let resp: NextResponse = NextResponse.json({}, {
    status: 200,
    statusText: 'OK',
  });

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
      "detail": `Неверный формат id события: ${eventId}`,
      "status": 422,
    }, {
      status: 422
    });
  }

  clog(`eventId is ${validateEventId(eventId) ? 'valid' : 'invalid'}\ninventoryId is ${validateInventoryId(inventoryId) ? 'valid' : 'invalid'}\nrequest body: %O\nresponding with status ${resp.status}, '${resp.statusText}'`, reqBody)


  return makeResponseCORSLess(resp);
}

