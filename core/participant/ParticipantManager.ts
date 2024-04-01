import { doTransaction } from '@/lib/prisma-transaction';
import { EventService } from '../event/EventService';
import { InventoryService } from '../inventory/InventoryService';
import { ParticipantService } from './ParticipantService';
import { TransactionSession } from '@/types/prisma';
import { UpdateInventoryData } from '@/app/api/inventories/[inventoryId]/participants/add/validation';
import { getRegisteredParticipants } from '@/lib/get-registered-participants';

export class ParticipantManager {
  private eventService: EventService;
  private inventoryService: InventoryService;
  private participantService: ParticipantService;

  constructor(
    eventService: EventService,
    inventoryService: InventoryService,
    participantService: ParticipantService
  ) {
    this.eventService = eventService;
    this.inventoryService = inventoryService;
    this.participantService = participantService;
  }

  async createInventoryParticipants(
    id: string,
    { eventId, participants }: UpdateInventoryData
  ) {
    return await doTransaction(async (session: TransactionSession) => {
      const eventService = this.eventService.withSession(session);
      const participantService = this.participantService.withSession(session);
      const inventoryService = this.inventoryService.withSession(session);

      await inventoryService.assertExistAndBelongEvent(id, eventId);

      await participantService.createMany(participants, eventId, id);

      const event = await eventService.getById(eventId);

      return { users: getRegisteredParticipants(event.participants) };
    });
  }
}
