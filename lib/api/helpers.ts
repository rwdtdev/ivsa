import { z } from 'zod';
import { NextResponse } from 'next/server';
import { b, cn } from './ansi-helpers';
import { EventService } from '@/core/event/EventService';
import { InventoryService } from '@/core/inventory/InventoryService';

export function makeResponseCORSLess(
  response: NextResponse | Response
): NextResponse | Response {
  response.headers.set('Access-Control-Allow-Origin', '*'); // N.B.: This is here to enable "Try it out" feature of swagger-ui to access localhost:3000 wuthout getting scared of CORS violations.
  return response;
}

export const validateTabelNumber = (tabelNumber: string) =>
  z.string().length(8).safeParse(tabelNumber, {}).success;

export const validateEventId = (eventId: string) =>
  z.string().cuid().safeParse(eventId, {}).success;

export const eventExists = async (eventService: EventService, eventId: string) =>
  await eventService
    .assertExist(eventId)
    .then(() => true)
    .catch(() => false);

export const genClog =
  (consoleLogPrefix: string) =>
  (textToLog: string, ...args: any) =>
    console.log(`${consoleLogPrefix}${textToLog}`, ...args);

// eslint-disable-next-line no-unused-vars
export const checkEventId = async (
  // eslint-disable-next-line no-unused-vars
  clog: (textToLog: string, ...args: any) => void,
  eventService: EventService,
  eventId: string
): Promise<NextResponse | Response | undefined> => {
  const isEventIdValid = validateEventId(eventId);

  const doesEventExist = isEventIdValid && (await eventExists(eventService, eventId));

  const done = (
    response: NextResponse | Response,
    options?: { isEventIdValid?: boolean; doesEventExist?: boolean }
  ) => {
    clog(
      `\n\teventId is ${options?.isEventIdValid ?? isEventIdValid ? b('valid').gr() : b('invalid').rd()} (${cn(eventId)})\n\tevent ${cn(eventId)} ${options?.doesEventExist ?? doesEventExist ? b('exists').gr() : b('does not exist').rd()}\n\t\t${b('Responding with status ')}${b(String(response.status)).yl()}, '${response.statusText}'\n`
    );
    return makeResponseCORSLess(response);
  };

  if (!isEventIdValid) {
    const resp = NextResponse.json(
      {
        type: 'urn:problem-type:unprocessable-content',
        title: 'Необрабатываемый контент',
        detail: `${eventId} не является валидным eventId`,
        status: 422
      },
      {
        status: 422
      }
    );

    return done(resp);
  }

  if (!doesEventExist) {
    const resp = NextResponse.json(
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

    return done(resp);
  }
};

export const validateInventoryId = (inventoryId: string) =>
  z.string().cuid().safeParse(inventoryId, {}).success; //????????добавить валидацию собственно inventoryId

export const inventoryExists = async (
  inventoryService: InventoryService,
  inventoryId: string
) =>
  await inventoryService
    .assertExist(inventoryId)
    .then(() => true)
    .catch(() => false);

// eslint-disable-next-line no-unused-vars
export const checkInventoryId = async (
  // eslint-disable-next-line no-unused-vars
  clog: (textToLog: string, ...args: any) => void,
  inventoryService: InventoryService,
  inventoryId: string
): Promise<NextResponse | Response | undefined> => {
  const isInventoryIdValid = validateInventoryId(inventoryId);

  const doesInventoryExist =
    isInventoryIdValid && (await inventoryExists(inventoryService, inventoryId));

  const done = (
    response: NextResponse | Response,
    options?: { isInventoryIdValid?: boolean; doesInventoryExist?: boolean }
  ) => {
    clog(
      `\n\tinventoryId is ${options?.isInventoryIdValid ?? isInventoryIdValid ? b('valid').gr() : b('invalid').rd()} (${cn(inventoryId)})\n\tevent ${cn(inventoryId)} ${options?.doesInventoryExist ?? doesInventoryExist ? b('exists').gr() : b('does not exist').rd()}\n\t\t${b('Responding with status ')}${b(String(response.status)).yl()}, '${response.statusText}'\n`
    );
    return makeResponseCORSLess(response);
  };

  if (!isInventoryIdValid) {
    const resp = NextResponse.json(
      {
        type: 'urn:problem-type:unprocessable-content',
        title: 'Необрабатываемый контент',
        detail: `${inventoryId} не является валидным inventoryId`,
        status: 422
      },
      {
        status: 422
      }
    );

    return done(resp);
  }

  if (!doesInventoryExist) {
    const resp = NextResponse.json(
      {
        type: 'urn:problem-type:entity-not-found',
        title: 'Сущность не существует',
        detail: `Опись с inventoryId ${inventoryId} не существует`,
        status: 404
      },
      {
        status: 404
      }
    );

    return done(resp);
  }
};
