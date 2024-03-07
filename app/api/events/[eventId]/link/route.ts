import { NextRequest, NextResponse } from 'next/server';
import { checkEventId, genClog, makeResponseCORSLess } from '@/lib/api/helpers';
import { b, cn, generateConsoleLogPrefix } from '@/lib/api/ansi-helpers';
import { EventService } from '@/server/services/events';

interface iContext {
  params: {
    eventId: string,
  };
}

export async function GET(request: NextRequest, context: iContext) {
  const CONSOLE_LOG_PREFIX = generateConsoleLogPrefix(request.method, '/api/events/{eventId}/link');

  const clog = genClog(CONSOLE_LOG_PREFIX);

  const { eventId } = context.params;

  const eventService = new EventService();

  const eventIdErrorResponse = await checkEventId(clog, eventService, eventId);

  if (eventIdErrorResponse !== undefined) {
    return eventIdErrorResponse;
  }

  const resp = NextResponse.json({
    'portalLink': `${request.nextUrl.host}/admin/events/${eventId}`,
  }, {
    status: 200,
    statusText: 'OK'
  });

  clog(`\n\teventId is ${b('valid').gr()} (${cn(eventId)})\n\tevent ${cn(eventId)} ${b('exists').gr()}\n\t\t${b('Responding with status ')}${b(String(resp.status)).yl()}, '${resp.statusText}'\n`);

  return makeResponseCORSLess(resp);
}
