import _ from 'underscore';

import { CreateEventData } from '@/app/api/events/validation';
import { ParticipantsData, UpdateEventData } from '@/app/api/events/[eventId]/validation';

import { ParticipantService } from '../participant/ParticipantService';
import { EventStatus } from '@prisma/client';
import { EventService } from './EventService';

export class EventManager {
  private eventService: EventService;
  private participantService: ParticipantService;

  constructor(eventService: EventService, participantService: ParticipantService) {
    this.eventService = eventService;
    this.participantService = participantService;
  }

  async createEvent(data: CreateEventData) {
    const created = await this.eventService.create(data);

    return created;
  }

  async updateEvent(id: string, data: UpdateEventData) {
    await this.eventService.update(id, _.omit(data, 'participants'));
  }

  async updateEventParticipants(eventId: string, participants: ParticipantsData) {
    await this.eventService.assertExist(eventId);
    await this.participantService.updateParticipants(eventId, participants);
  }

  async removeEventLogical(id: string) {
    await this.eventService.update(id, { status: EventStatus.REMOVED });
  }
}
