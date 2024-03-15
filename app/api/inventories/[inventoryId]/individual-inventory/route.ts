import { NextRequest, NextResponse } from 'next/server';
import { getErrorResponse } from '@/lib/helpers';
import {
  CreateIndividualInventorySchema,
  PathParamsSchema,
  RemoveIndividualInvenoryPathParamsSchema,
  RemoveIndividualInvenoryQueryParamsSchema
} from './validation';

import { InventoryService } from '@/core/inventory/InventoryService';
import { IvaService } from '@/core/iva/IvaService';
import { EventService } from '@/core/event/EventService';
import { AuditRoomManager } from '@/core/audit-room/AuditRoomManager';
import { InventoryObjectService } from '@/core/inventory-object/InventoryObjectService';

interface IContext {
  params: {
    inventoryId: string;
    complexInventoryId: string;
    inventoryNumber: string;
    inventoryDate: Date;
    inventoryContainerObject: object;
  };
}

export async function DELETE(request: NextRequest, context: IContext) {
  const inventoryService = new InventoryService();

  try {
    const { inventoryId: complexInventoryId } =
      RemoveIndividualInvenoryPathParamsSchema.parse(context.params);

    const { searchParams } = new URL(request.url);

    const { eventId, inventoryId: individualInventoryId } =
      RemoveIndividualInvenoryQueryParamsSchema.parse({
        eventId: searchParams.get('eventId'),
        inventoryId: searchParams.get('inventoryId')
      });

    await inventoryService.assertExistAndBelongEvent(complexInventoryId, eventId);
    await inventoryService.assertExist(individualInventoryId);
    await inventoryService.assertIsParent(complexInventoryId, individualInventoryId);

    await inventoryService.removeInventoryLogical(individualInventoryId);

    return new Response(null, { status: 204 });
  } catch (error) {
    return getErrorResponse(error);
  }
}

export async function POST(request: NextRequest, context: IContext) {
  let conferenceSessionId;

  const auditRoomManager = new AuditRoomManager(
    new IvaService(),
    new EventService(),
    new InventoryService(),
    new InventoryObjectService()
  );

  try {
    const { inventoryId } = PathParamsSchema.parse(context.params);

    const response = await auditRoomManager.createRoom({
      ...CreateIndividualInventorySchema.parse(await request.json()),
      inventoryId
    });

    conferenceSessionId = response.auditId;

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    await auditRoomManager.closeConference(conferenceSessionId);

    return getErrorResponse(error);
  }
}
