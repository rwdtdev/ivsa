import { getErrorResponse } from '@/lib/helpers';
import { NextRequest } from 'next/server';
import { PathParamsSchema, UpdateInventorySchema } from './validation';
import { doTransaction } from '@/lib/prisma-transaction';
import { TransactionSession } from '@/types/prisma';
import { InventoryService } from '@/core/inventory/InventoryService';
import { ParticipantService } from '@/core/participant/ParticipantService';
import { assertAPICallIsAuthorized } from '@/lib/api/helpers';

interface IContext {
  params: { inventoryId: string };
}

export async function PUT(request: NextRequest, context: IContext) {
  const inventoryService = new InventoryService();
  const participantService = new ParticipantService();

  try {
    assertAPICallIsAuthorized(request);

    const { inventoryId } = PathParamsSchema.parse(context.params);
    const { eventId, participants } = UpdateInventorySchema.parse(await request.json());

    return await doTransaction(async (session: TransactionSession) => {
      const eventParticipantServiceWithSession = participantService.withSession(session);

      await inventoryService.assertExistAndBelongEvent(inventoryId, eventId);

      await eventParticipantServiceWithSession.createMany(
        participants,
        eventId,
        inventoryId
      );

      return new Response(null, { status: 204 });
    });
  } catch (error) {
    return getErrorResponse(error);
  }
}
