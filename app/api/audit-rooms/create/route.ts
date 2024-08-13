import { getErrorResponse, getUnknownErrorText } from '@/lib/helpers';
import { NextRequest, NextResponse } from 'next/server';
import { CreateInventorySchema } from './validation';

import { IvaService } from '@/core/iva/IvaService';
import { EventService } from '@/core/event/EventService';
import { InventoryService } from '@/core/inventory/InventoryService';
import { InventoryObjectService } from '@/core/inventory-object/InventoryObjectService';
import { AuditRoomManager } from '@/core/audit-room/AuditRoomManager';
import { getClientIP } from '@/lib/helpers/ip';
import { ActionService } from '@/core/action/ActionService';
import { ActionStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  const ip = getClientIP(req.headers);
  const actionService = new ActionService();
  const auditRoomManager = new AuditRoomManager(
    new IvaService(),
    new EventService(),
    new InventoryService(),
    new InventoryObjectService()
  );

  let params;
  let conferenceSessionId;

  try {
    params = CreateInventorySchema.parse(await req.json());

    const response = await auditRoomManager.createRoom(params);

    conferenceSessionId = response.auditId;

    await actionService.addOpenAuditRoomActionLog(ip, ActionStatus.SUCCESS, {
      eventId: params.eventId,
      inventoryId: params.inventoryId,
      inventoryCode: params.inventoryCode,
      inventoryNumber: params.inventoryNumber
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (conferenceSessionId) {
      await auditRoomManager.closeConference(conferenceSessionId);
    }

    await actionService.addOpenAuditRoomActionLog(ip, ActionStatus.ERROR, {
      error: getUnknownErrorText(error),
      eventId: params?.eventId,
      inventoryId: params?.inventoryId
    });

    return getErrorResponse(error, req);
  }
}
