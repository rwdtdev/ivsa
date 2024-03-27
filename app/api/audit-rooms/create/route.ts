import { getErrorResponse } from '@/lib/helpers';
import { NextRequest, NextResponse } from 'next/server';
import { CreateInventorySchema } from './validation';

import { IvaService } from '@/core/iva/IvaService';
import { EventService } from '@/core/event/EventService';
import { InventoryService } from '@/core/inventory/InventoryService';
import { InventoryObjectService } from '@/core/inventory-object/InventoryObjectService';
import { AuditRoomManager } from '@/core/audit-room/AuditRoomManager';
import { assertAPICallIsAuthorized } from '@/lib/api/helpers';

export async function POST(request: NextRequest) {
  let conferenceSessionId;

  const auditRoomManager = new AuditRoomManager(
    new IvaService(),
    new EventService(),
    new InventoryService(),
    new InventoryObjectService()
  );

  try {
    assertAPICallIsAuthorized(request);
    
    const response = await auditRoomManager.createRoom(
      CreateInventorySchema.parse(await request.json())
    );

    conferenceSessionId = response.auditId;

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (conferenceSessionId) {
      await auditRoomManager.closeConference(conferenceSessionId);
    }

    return getErrorResponse(error);
  }
}
