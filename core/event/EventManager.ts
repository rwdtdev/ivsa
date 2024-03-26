import _ from 'underscore';

import { CreateEventData } from '@/app/api/events/validation';
import { ParticipantsData, UpdateEventData } from '@/app/api/events/[eventId]/validation';

import { ParticipantService } from '../participant/ParticipantService';
import { EventStatus, UserStatus } from '@prisma/client';
import { EventService } from './EventService';
import { UserService } from '../user/UserService';
import { toUTCDatetime } from '@/lib/helpers/dates';

export class EventManager {
  private eventService: EventService;
  private participantService: ParticipantService;
  private userService: UserService;

  constructor(
    eventService: EventService,
    participantService: ParticipantService,
    userService: UserService
  ) {
    this.eventService = eventService;
    this.participantService = participantService;
    this.userService = userService;
  }

  async createEvent(data: CreateEventData) {
    const event = await this.eventService.create(data);

    return {
      eventId: event.id,
      users: event.participants
        .filter(({ user }) => user)
        .map(({ user }) => ({
          tabelNumber: user.tabelNumber,
          expiresAt: toUTCDatetime(user.expiresAt),
          isRecused: user.status === UserStatus.RECUSED,
          isBlocked:
            user.status === UserStatus.BLOCKED || user.expiresAt.getTime() < Date.now()
        }))
    };
  }

  async updateEvent(id: string, data: UpdateEventData) {
    await this.eventService.assertExist(id);
    await this.eventService.update(id, _.omit(data, 'participants'));

    if (data.participants) {
      const participants = await this.linkParticipantsToUsers(data.participants);

      await this.participantService.updateParticipants(id, participants);
    }

    const event = await this.eventService.getById(id);

    return {
      eventId: event.id,
      users: event.participants
        .filter(({ user }) => user)
        .map(({ user }) => ({
          tabelNumber: user.tabelNumber,
          expiresAt: toUTCDatetime(user.expiresAt),
          isRecused: user.status === UserStatus.RECUSED,
          isBlocked:
            user.status === UserStatus.BLOCKED || user.expiresAt.getTime() < Date.now()
        }))
    };
  }

  private async linkParticipantsToUsers(participants: ParticipantsData) {
    const participantPromises = participants.map(async (participant) => {
      const user = await this.userService.getByTabelNumber(participant.tabelNumber);

      return { ...participant, ...(user && { userId: user.id }) };
    });

    return Promise.all(participantPromises);
  }

  async updateEventParticipants(eventId: string, data: ParticipantsData) {
    await this.eventService.assertExist(eventId);

    const participants = await this.linkParticipantsToUsers(data);

    await this.participantService.updateParticipants(eventId, participants);
  }

  async removeEventLogical(id: string) {
    await this.eventService.update(id, { status: EventStatus.REMOVED });
  }
}
