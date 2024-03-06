import { NextRequest, NextResponse } from 'next/server';
import { makeResponseCORSLess, validateEventId } from '@/lib/api/helpers';
import { b, cn, generateConsoleLogPrefix } from '@/lib/api/ansi-helpers';

interface iContext {
  params: {
    eventId: string;
  };
}

export async function GET(request: NextRequest, context: iContext) {
  const CONSOLE_LOG_PREFIX = generateConsoleLogPrefix(
    request.method,
    '/api/events/{eventId}/link'
  );
  const clog = (textToLog: string) => console.log(`${CONSOLE_LOG_PREFIX}${textToLog}`);
  const { eventId } = context.params;

  const isEventIdValid = validateEventId(eventId);

  // Placeholder response
  let resp: NextResponse = NextResponse.json(
    {
      portalLink: 'https://www.ourdomain.ru/12302488-1ec4-4491-a9d1-4b1ba6e0a1eb'
    },
    {
      status: 200,
      statusText: 'OK'
    }
  );

  if (!isEventIdValid) {
    resp = NextResponse.json(
      {
        type: 'urn:problem-type:entity-not-found',
        title: 'Сущность не существует',
        detail: `Событие с eventId ${eventId} не существует`,
        status: 404
      },
      {
        status: 404
      }
    );
  }

  clog(
    `eventId is ${isEventIdValid ? b('valid').gr() : b('invalid').rd()} (${cn(eventId)})\nresponding with status ${resp.status}, '${resp.statusText}'`
  );

  return makeResponseCORSLess(resp);
}
