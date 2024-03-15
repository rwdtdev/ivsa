import _ from 'underscore';
import { SoiParticipantRoles } from '@/constants/mappings/soi';
import { TransactionSession } from '@/types/prisma';
import { PrismaClient, UserRole } from '@prisma/client';
import { ContainAlreadyExistParticipantsError } from './errors';
import { ParticipantsData } from '@/app/api/events/[eventId]/validation';

export class ParticipantService {
  private prisma: PrismaClient | TransactionSession;

  constructor(session?: TransactionSession) {
    this.prisma = session ?? prisma;
  }

  withSession(session: TransactionSession) {
    return new ParticipantService(session);
  }

  async getAllByInventoryAndEventIds(inventoryId: string, eventId: string) {
    const participants = await this.prisma.participant.findMany({
      where: { inventoryId, eventId }
    });

    return participants;
  }

  async isHaveNotRegistered(tabelNumber: string) {
    // Find inventories and events when tabel number is not have user
    const count = this.prisma.participant.count({
      where: { tabelNumber, userId: null }
    });

    return Boolean(count || count > 0);
  }

  async linkParticipantsWithUser(userId: string, tabelNumber: string) {
    await this.prisma.participant.updateMany({
      data: { userId },
      where: { tabelNumber }
    });
  }

  async createMany(participants: ParticipantsData, eventId: string, inventoryId: string) {
    const participantPromises = participants.map(async (participant) => {
      const user = await this.prisma.user.findFirst({
        where: { tabelNumber: participant.tabelNumber }
      });

      return {
        eventId,
        inventoryId,
        userId: (user && user.id) || null,
        tabelNumber: (user && user.tabelNumber) || participant.tabelNumber,
        role:
          SoiParticipantRoles[participant.roleId as keyof typeof SoiParticipantRoles] ||
          UserRole.PARTICIPANT
      };
    });

    await this.prisma.participant.createMany({
      data: await Promise.all(participantPromises)
    });
  }

  async assertExistDuplicatesTabelNumbers(
    inventoryId: string,
    eventId: string,
    tabelNumbers: string[]
  ) {
    const existParticipants = await this.prisma.participant.findMany({
      where: {
        inventoryId,
        eventId,
        tabelNumber: { in: tabelNumbers }
      }
    });

    if (existParticipants && !_.isEmpty(existParticipants)) {
      const tabelNumbers = existParticipants.map(
        (existParticipant) => existParticipant.tabelNumber
      );

      throw new ContainAlreadyExistParticipantsError({
        detail: `Tabel numbers [${tabelNumbers.join(',')}] already been added to the inventory participants.`
      });
    }
  }

  async updateParticipants(eventId: string, participants: ParticipantsData) {
    await this.prisma.participant.deleteMany({
      where: { eventId, inventoryId: null }
    });

    const promises = participants.map(async (participant) => {
      await this.prisma.participant.create({
        data: {
          tabelNumber: participant.tabelNumber,
          inventoryId: null,
          eventId,
          role: SoiParticipantRoles[
            participant.roleId as keyof typeof SoiParticipantRoles
          ]
        }
      });
    });

    await Promise.all(promises);
  }

  async removeInventoryParticipants(inventoryId: string, eventId: string) {
    await this.prisma.participant.deleteMany({
      where: { eventId, inventoryId }
    });
  }

  async update(inventoryId: string, eventId: string, data: any) {
    await this.prisma.participant.updateMany({
      data,
      where: {
        inventoryId,
        eventId
      }
    });
  }
}
