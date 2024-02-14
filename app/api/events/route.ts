import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/server/services/prisma';
import {
    makeResponseCORSLess, validateTabelNumber,
} from '@/lib/api/helpers';
import {
    generateConsoleLogPrefix,
} from '@/lib/api/ansi-helpers';

export async function POST(request: NextRequest) {
  const CONSOLE_LOG_PREFIX = generateConsoleLogPrefix(request.method, '/api/events');
  const clog = (textToLog: string, ...args: any) => console.log(`${CONSOLE_LOG_PREFIX}${textToLog}`, ...args);

  const reqBody = await request.json();

  // Placeholder response
  let resp: NextResponse = NextResponse.json({
    "eventId": "0433abdd-f103-40ed-b1b9-81f40aa0288a"
  }, {
    status: 201,
    statusText: 'Created',
  });


  interface requestBodyArrayElement {
    tabelNumber: string;
    roleId: number;
  }
  const invalidTabNum = reqBody.participants.find((el: requestBodyArrayElement) => !validateTabelNumber(el.tabelNumber));
  if (invalidTabNum !== undefined) {
    resp = NextResponse.json({
      "type": "urn:problem-type:unprocessable-content",
      "title": "Необрабатываемый контент",
      "detail": `Невалидный пользователь: ${invalidTabNum.tabelNumber}`,
      "status": 422,
    }, {
      status: 422
    });
  }

  clog(`request body: %O\nresponding with status ${resp.status}, '${resp.statusText}'`, reqBody)

  return makeResponseCORSLess(resp);
}
