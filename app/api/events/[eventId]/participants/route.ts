import { NextRequest, NextResponse } from 'next/server';
import {
  makeResponseCORSLess,
  validateEventId,
  validateTabelNumber
} from '@/lib/api/helpers';
import { generateConsoleLogPrefix } from '@/lib/api/ansi-helpers';

interface iContext {
  params: {
    eventId: string;
  };
}

export async function PUT(request: NextRequest, context: iContext) {
  const CONSOLE_LOG_PREFIX = generateConsoleLogPrefix(
    request.method,
    '/api/events/[eventId]/participants'
  );
  const clog = (textToLog: string, ...args: any) =>
    console.log(`${CONSOLE_LOG_PREFIX}${textToLog}`, ...args);

  const reqBody = await request.json();
  const { eventId } = context.params;

  // Placeholder response
  let resp: NextResponse = new NextResponse(undefined, { status: 204 });

  if (!validateEventId(eventId)) {
    resp = NextResponse.json(
      {
        type: 'urn:problem-type:unprocessable-content',
        title: 'Необрабатываемый контент',
        detail: `Событие с eventId ${eventId} не найдено`,
        status: 404
      },
      {
        status: 404
      }
    );
  }

  interface requestBodyArrayElement {
    tabelNumber: string;
    roleId: number;
  }
  const invalidTabNum = reqBody.find(
    (el: requestBodyArrayElement) => !validateTabelNumber(el.tabelNumber)
  );
  if (invalidTabNum !== undefined) {
    resp = NextResponse.json(
      {
        type: 'urn:problem-type:unprocessable-content',
        title: 'Необрабатываемый контент',
        detail: `Невалидный пользователь: ${invalidTabNum.tabelNumber}`,
        status: 422
      },
      {
        status: 422
      }
    );
  }

  clog(
    `eventId is ${validateEventId(eventId) ? 'valid' : 'invalid'}\nrequest body: %O\nresponding with status ${resp.status}, '${resp.statusText}'`,
    reqBody
  );

  return makeResponseCORSLess(resp);
}
