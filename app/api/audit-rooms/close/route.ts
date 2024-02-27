import IvaAPI from '@/server/services/iva/api';
import { doTransaction } from '@/lib/prisma-transaction';
import { EventService } from '@/server/services/events';
import { TransactionSession } from '@/types/prisma';
import { NextRequest } from 'next/server';
import { EventStatus } from '@prisma/client';
import { getErrorResponse } from '@/lib/helpers';
import { AuditRoomIsNotOpened } from './errors';
import { InventoryService } from '@/server/services/inventories';

export async function PUT(request: NextRequest) {
  const reqBody = await request.json();
  const eventId = reqBody.eventId;
  const inventoryId = reqBody.inventoryId;

  try {
    return await doTransaction(async (txSession: TransactionSession) => {
      const eventServiceWithSession = EventService.withSession(txSession);
      const inventoryServiceWithSession = InventoryService.withSession(txSession);

      await eventServiceWithSession.assertExist(eventId);
      await inventoryServiceWithSession.assertExistAndBelongEvent(inventoryId, eventId);

      const inventory = await inventoryServiceWithSession.getById(inventoryId);

      if (!inventory.auditSessionId) {
        throw new AuditRoomIsNotOpened({
          detail: `Комната для описи (${inventoryId}) не открыта`
        });
      }

      await IvaAPI.conferenceSessions.closeRoom(inventory.auditSessionId);

      await eventServiceWithSession.update(eventId, {
        status: EventStatus.CLOSED
      });

      return new Response(null, { status: 204 });
    });
  } catch (error) {
    return getErrorResponse(error);
  }
}
