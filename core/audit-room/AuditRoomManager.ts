import _ from 'underscore';
import { doTransaction } from '@/lib/prisma-transaction';
import { InventoryService } from '@/core/inventory/InventoryService';
import { InventoryObjectService } from '@/core/inventory-object/InventoryObjectService';
import { TransactionSession } from '@/types/prisma';
import {
  AuditRoomIsNotOpened,
  BriefingRoomIsStillOpenError,
  EmptyPartisipantsListError
} from './errors';
import { BriefingStatus, EventStatus, UserStatus } from '@prisma/client';
import { InventoryCodes } from '@/core/inventory/types';
import { CreateInventoryData } from '@/app/api/audit-rooms/create/validation';
import { getDateFromString } from '@/server/utils';
import { mapToInventoryObject } from '@/core/inventory/mappers/InventoryObjectsMapper';
import { IvaService } from '../iva/IvaService';
import { IvaRoles, IvaRolesMapper } from '@/constants/mappings/iva';
import { CloseAuditRoomData } from '@/app/api/audit-rooms/close/validation';
import { EventService } from '../event/EventService';
import { toUTCDatetime } from '@/lib/helpers/dates';
import { ParticipantWithUser } from '../event/types';

export class AuditRoomManager {
  private ivaService: IvaService;
  private eventService: EventService;
  private inventoryService: InventoryService;
  private inventoryObjectService: InventoryObjectService;

  constructor(
    ivaService: IvaService,
    eventService: EventService,
    inventoryService: InventoryService,
    inventoryObjectService: InventoryObjectService
  ) {
    this.ivaService = ivaService;
    this.eventService = eventService;
    this.inventoryService = inventoryService;
    this.inventoryObjectService = inventoryObjectService;
  }

  async getAuditJoinLink(conferenceSessionId: string): Promise<string> {
    const participants = await this.ivaService.findConferenceParticipants(
      conferenceSessionId,
      { requestedData: ['JOIN_LINK'] }
    );

    return participants[0].joinLink;
  }

  async createRoom({
    eventId,
    inventoryId,
    complexInventoryId,
    inventoryCode,
    inventoryDate,
    inventoryNumber,
    inventoryObjects
  }: CreateInventoryData & { complexInventoryId?: string }) {
    return await doTransaction(async (session: TransactionSession) => {
      const eventService = this.eventService.withSession(session);
      const inventoryService = this.inventoryService.withSession(session);
      const inventoryObjectService = this.inventoryObjectService.withSession(session);

      await eventService.assertExist(eventId);

      if (complexInventoryId) {
        await inventoryService.assertNotExist(complexInventoryId);
        await inventoryService.assertExistAndBelongEvent(inventoryId, eventId);
      } else {
        await inventoryService.assertNotExist(inventoryId);
      }

      const event = await eventService.getById(eventId);

      if (event.briefingStatus === BriefingStatus.IN_PROGRESS) {
        throw new BriefingRoomIsStillOpenError();
      }

      if (_.isEmpty(event.participants)) {
        throw new EmptyPartisipantsListError();
      }

      const registeredAndNotBlockedParticipants = event.participants.filter(
        ({ user }: ParticipantWithUser) =>
          user &&
          user.ivaProfileId &&
          user.status !== UserStatus.BLOCKED &&
          user.status !== UserStatus.RECUSED
      );

      console.warn(registeredAndNotBlockedParticipants);

      const speaker = registeredAndNotBlockedParticipants.find(
        ({ role }) => IvaRolesMapper[role] === IvaRoles.SPEAKER
      );

      const speakerIvaProfileId = eventService.validateSpeakerAndGetIvaProfileId(speaker);

      const createdInventory = await inventoryService.create({
        eventId,
        id: complexInventoryId ?? inventoryId,
        name: InventoryCodes[inventoryCode].name,
        code: inventoryCode,
        number: inventoryNumber,
        shortName: InventoryCodes[inventoryCode].shortName,
        date: getDateFromString(inventoryDate),
        ...(complexInventoryId && { parentId: inventoryId })
      });

      const intentoryObjectPromises = inventoryObjects.map(async (object: any) =>
        inventoryObjectService.create({
          ...mapToInventoryObject(inventoryCode, object),
          inventoryId: createdInventory.id
        })
      );

      await Promise.all(intentoryObjectPromises);

      const conference = await this.ivaService.createConference({
        name: `Видеоинвентаризация по описи №${inventoryNumber}`,
        description: 'Видеоинвентаризация',
        owner: { profileId: speakerIvaProfileId },
        conferenceTemplateId: '471f7e4e-15b7-48fc-bf34-88488b4e14dc',
        settings: {
          joinRestriction: 'INVITED_OR_REGISTERED',
          attendeePermissions: [
            'SPEAKER_OTHER',
            'CHAT_SEND_WITHOUT_PREMODERATION',
            'INVITING_PARTICIPANTS',
            'PUBLISH_MESSAGES_IN_CHAT',
            'RECEIVE_MEDIA',
            'RECORD_ACCESS',
            'DOWNLOAD_DOCUMENTS',
            'UPLOAD_DOCUMENT',
            'DEMONSTRATE_DOCUMENTS',
            'DOWNLOAD_RECORD'
          ],
          attendeeMediaState: 'AUDIO_VIDEO',
          features: [
            { key: 'ACTIVE_SPEAKER_INDICATION', value: true },
            { key: 'MUTE_EXTERNAL_NOTIFICATIONS', value: true },
            { key: 'ALWAYS_SHOW_PARTICIPANT_IN_STAGE', value: true }
          ]
        },
        participants: registeredAndNotBlockedParticipants.map(({ user, role }) => ({
          interlocutor: { profileId: user.ivaProfileId as string },
          roles: [IvaRolesMapper[role]],
          interpreterLanguagesPair: ['RUSSIAN']
        }))
      });
      const link = await this.getAuditJoinLink(conference.conferenceSessionId);

      await inventoryService.update(inventoryId, {
        auditRoomInviteLink: link,
        auditSessionId: conference.conferenceSessionId
      });

      return {
        auditId: conference.conferenceSessionId,
        auditLink: link,
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
    });
  }

  async closeConference(conferenceSessionId: string) {
    await this.ivaService.closeConference(conferenceSessionId);
  }

  async closeRoom({ eventId, inventoryId }: CloseAuditRoomData) {
    return await doTransaction(async (session: TransactionSession) => {
      const eventService = this.eventService.withSession(session);
      const inventoryService = this.inventoryService.withSession(session);

      await eventService.assertExist(eventId);
      await inventoryService.assertExistAndBelongEvent(inventoryId, eventId);

      const inventory = await inventoryService.getById(inventoryId);

      if (!inventory.auditSessionId) {
        throw new AuditRoomIsNotOpened({
          detail: `Audit room with id (${inventoryId}) is not opened`
        });
      }

      await eventService.update(eventId, { status: EventStatus.CLOSED });
    });
  }
}
