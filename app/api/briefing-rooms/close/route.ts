import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/server/services/prisma';
import {
    makeResponseCORSLess, validateEventId,
} from '@/lib/api/helpers';
import {
    generateConsoleLogPrefix,
} from '@/lib/api/ansi-helpers';

export async function PUT(request: NextRequest) {
    const CONSOLE_LOG_PREFIX = generateConsoleLogPrefix(request.method, '/api/briefing-rooms/close');
    const clog = (textToLog: string, ...args: any) => console.log(`${CONSOLE_LOG_PREFIX}${textToLog}`, ...args);

    const reqBody = await request.json();
    const eventId = reqBody.eventId;

     // Placeholder response
     let resp: NextResponse = new NextResponse(undefined, { status: 204 });

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

     clog(`eventId is ${validateEventId(eventId) ? 'valid' : 'invalid'}\nrequest body: %O\nresponding with status ${resp.status}, '${resp.statusText}'`, reqBody)

    return makeResponseCORSLess(resp);
}
