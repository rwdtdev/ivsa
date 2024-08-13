import { NextRequest } from 'next/server';
import { getErrorResponse, getUnknownErrorText } from '@/lib/helpers';
import { CloseAuditRoomBodySchema } from './validation';

import { IvaService } from '@/core/iva/IvaService';
import { EventService } from '@/core/event/EventService';
import { InventoryService } from '@/core/inventory/InventoryService';

import { AuditRoomManager } from '@/core/audit-room/AuditRoomManager';
import { InventoryObjectService } from '@/core/inventory-object/InventoryObjectService';
import { getClientIP } from '@/lib/helpers/ip';
import { ActionService } from '@/core/action/ActionService';
import { ActionStatus } from '@prisma/client';

export async function PUT(req: NextRequest) {
  const ip = getClientIP(req);
  const actionService = new ActionService();
  const auditRoomManager = new AuditRoomManager(
    new IvaService(),
    new EventService(),
    new InventoryService(),
    new InventoryObjectService()
  );

  let params;

  try {
    params = CloseAuditRoomBodySchema.parse(await req.json());

    await auditRoomManager.closeRoom(params);
    await actionService.addCloseAuditRoomActionLog(ip, ActionStatus.SUCCESS, {
      eventId: params.eventId,
      inventoryId: params.inventoryId
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    await actionService.addCloseAuditRoomActionLog(ip, ActionStatus.ERROR, {
      error: getUnknownErrorText(error),
      eventId: params?.eventId,
      inventoryId: params?.inventoryId
    });

    return getErrorResponse(error, req);
  }
}
