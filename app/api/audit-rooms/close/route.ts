import { NextRequest } from 'next/server';
import { getErrorResponse } from '@/lib/helpers';
import { CloseAuditRoomBodySchema } from './validation';

import { IvaService } from '@/core/iva/IvaService';
import { EventService } from '@/core/event/EventService';
import { InventoryService } from '@/core/inventory/InventoryService';

import { AuditRoomManager } from '@/core/audit-room/AuditRoomManager';
import { InventoryObjectService } from '@/core/inventory-object/InventoryObjectService';

export async function PUT(request: NextRequest) {
  const auditRoomManager = new AuditRoomManager(
    new IvaService(),
    new EventService(),
    new InventoryService(),
    new InventoryObjectService()
  );

  try {
    await auditRoomManager.closeRoom(
      CloseAuditRoomBodySchema.parse(await request.json())
    );

    return new Response(null, { status: 204 });
  } catch (error) {
    return getErrorResponse(error);
  }
}
