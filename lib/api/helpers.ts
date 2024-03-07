import { z } from 'zod';
import { NextResponse } from "next/server";
import { b, cn } from './ansi-helpers';
import { EventService } from '@/server/services/events';

export function makeResponseCORSLess(response: NextResponse | Response): NextResponse | Response {
  response.headers.set('Access-Control-Allow-Origin', '*'); // N.B.: This is here to enable "Try it out" feature of swagger-ui to access localhost:3000 wuthout getting scared of CORS violations.
  return response;
}

export const validateTabelNumber = (tabelNumber: string) => z.string().length(8).safeParse(tabelNumber, {}).success;

export const validateEventId = (eventId: string) => z.string().cuid().safeParse(eventId, {}).success;

export const eventExists = async (eventService: EventService, eventId: string) => await eventService.assertExist(eventId).then(() => true).catch(() => false);

export const genClog = (consoleLogPrefix: string) => (textToLog: string, ...args: any) => console.log(`${consoleLogPrefix}${textToLog}`, ...args);

// eslint-disable-next-line no-unused-vars
export const checkEventId = async (clog: (textToLog: string, ...args: any) => void, eventService: EventService, eventId: string): Promise<NextResponse | Response | undefined> => {
  const isEventIdValid = validateEventId(eventId);

  const doesEventExist = isEventIdValid && await eventExists(eventService, eventId);
  
  const done = (response: NextResponse | Response, options?: { isEventIdValid?: boolean, doesEventExist?: boolean }) => {
    clog(`\n\teventId is ${ (options?.isEventIdValid ?? isEventIdValid) ? b('valid').gr() : b('invalid').rd()} (${cn(eventId)})\n\tevent ${cn(eventId)} ${ (options?.doesEventExist ?? doesEventExist) ? b('exists').gr() : b('does not exist').rd()}\n\t\t${b('Responding with status ')}${b(String(response.status)).yl()}, '${response.statusText}'\n`);
    return makeResponseCORSLess(response);
  }
  
  if (!isEventIdValid) {
    const resp = NextResponse.json({
      "type": "urn:problem-type:unprocessable-content",
      "title": "Необрабатываемый контент",
      "detail": `${eventId} не является валидным eventId`,
      "status": 422,
    }, {
      status: 422
    });
  
    return done(resp);
  }
  
  if (!doesEventExist) {
    const resp = NextResponse.json({
      "type": "urn:problem-type:entity-not-found",
      "title": "Сущность не существует",
      "detail": `Событие с eventId ${eventId} не существует`,
      "status": 404,
    }, {
      status: 404
    });
  
    return done(resp);
  }
}

const VALID_INVENTORY_IDS = [
  'cls1ufnb4001g08l5gj1l3e57',
  'cls1ufnb4001h08l57pil02sg',
  'cls1ufnb4001i08l53hpl64wa',
  'cls1ufnb4001j08l5628b75b8',
  'cls1ufnb4001k08l58y023t1b',
  'cls1ufnb4001l08l5981w702f',
  'cls1ufnb4001m08l57qe6d7pl',
  'cls1ufnb4001n08l5hc768ox3',
  'cls1ufnb4001o08l5af3thflv',
  'cls1ufnb4001p08l58oax7xry',
];
export const validateInventoryId = (inventoryId: string): boolean => {
  return VALID_INVENTORY_IDS.includes(inventoryId);
}
