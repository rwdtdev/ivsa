import { NextRequest, NextResponse } from 'next/server';
import { checkEventId, genClog, makeResponseCORSLess } from '@/lib/api/helpers';
import { b, cn, generateConsoleLogPrefix } from '@/lib/api/ansi-helpers';
import { EventService } from '@/core/event/EventService';
import { InventoryService } from '@/core/inventory/InventoryService';
import { Inventory } from '@prisma/client';
import { InventoryCodes } from '@/core/inventory/types';

interface iContext {
  params: {
    inventoryId: string;
  };
}

export async function POST(request: NextRequest, context: iContext) {
  const CONSOLE_LOG_PREFIX = generateConsoleLogPrefix(
    request.method,
    '/api/inventories/[inventoryId]/update'
  );
  const clog = genClog(CONSOLE_LOG_PREFIX);
  const { inventoryId } = context.params;
  const reqBody = await request.json();
  const eventId = reqBody.eventId;

  const eventService = new EventService();
  const eventIdErrorResponse = await checkEventId(clog, eventService, eventId);
  if (eventIdErrorResponse !== undefined) {
    return eventIdErrorResponse;
  }

  const inventoryService = new InventoryService();

  try {
    await inventoryService.assertExistAndBelongEvent(inventoryId, eventId);

    const currentInventory = await inventoryService.getById(inventoryId);

    const newOrOld = (bodyPropName: string, inventoryPropName: string) =>
      reqBody[bodyPropName] ?? currentInventory[inventoryPropName as keyof Inventory];

    await inventoryService.update(inventoryId, {
      eventId: newOrOld('eventId', 'eventId'),
      number: newOrOld('inventoryNumber', 'number'),
      code: newOrOld('inventoryCode', 'code'),
      shortName:
        InventoryCodes[newOrOld('inventoryCode', 'code') as keyof typeof InventoryCodes]
          .shortName,
      name: InventoryCodes[
        newOrOld('inventoryCode', 'code') as keyof typeof InventoryCodes
      ].name,
      date: newOrOld('inventoryDate', 'date'),
      status: newOrOld('inventoryStatus', 'status'),
      parentId: newOrOld('inventoryParentId', 'parentId')
    });

    //reqBody.inventoryObjects.

    const resp: NextResponse = new NextResponse(undefined, { status: 204 });

    clog(
      `\n\teventId is ${b('valid').gr()} (${cn(eventId)})\n\tevent ${cn(eventId)} ${b('exists').gr()}\n\tinventoryId is ${b('valid').gr()} (${cn(eventId)})\n\t\trequest body: %O\n\t\t${b('Responding with status ')}${resp.status}, '${resp.statusText}'\n`,
      reqBody
    );

    return makeResponseCORSLess(resp);
  } catch (err: any) {
    clog(
      `\n\t[${err}]\n\t${b('No event-inventory pair found!').rd()} (${cn(eventId)} --- ${cn(inventoryId)})`
    );

    const resp = NextResponse.json(
      {
        ...err
      },
      {
        status: err.status
      }
    );

    return makeResponseCORSLess(resp);
  }
}
