import _ from 'underscore';
import { doTransaction } from '@/lib/prisma-transaction';
import { InventoryService } from '@/core/inventory/InventoryService';
import { InventoryObjectService } from '@/core/inventory-object/InventoryObjectService';
import { TransactionSession } from '@/types/prisma';
import {
  AuditRoomAlreadyClosed,
  AuditRoomIsNotOpened,
  BriefingRoomIsStillOpenError,
  EmptyPartisipantsListError,
  ParticipantsMustContainModeratorError
} from './errors';
import {
  BriefingStatus,
  EventStatus,
  InventoryStatus,
  UserRole,
  UserStatus
} from '@prisma/client';
import { InventoryCodes } from '@/core/inventory/types';
import { CreateInventoryData } from '@/app/api/audit-rooms/create/validation';
import { getDateFromString } from '@/utils';
import { mapToInventoryObject } from '@/core/inventory/mappers/InventoryObjectsMapper';
import { IvaService } from '../iva/IvaService';
import { IvaRoles, IvaRolesMapper } from '@/constants/mappings/iva';
import { CloseAuditRoomData } from '@/app/api/audit-rooms/close/validation';
import { EventService } from '../event/EventService';
import { ParticipantWithUser } from '../event/types';
import { getRegisteredParticipants } from '@/lib/helpers/responses';
import { generatePassword } from '@/utils/generate-password';

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
    const { protocol, hostname, port } = new URL(process.env.IVA_API_URL as string);

    return `${protocol}//${hostname}${port ? ':' + port : ''}/#join:s${conferenceSessionId}`;

    // const participants = await this.ivaService.findConferenceParticipants(
    //   conferenceSessionId,
    //   { requestedData: ['JOIN_LINK'] }
    // );

    // return participants[0].joinLink;
  }

  async createRoom({
    eventId,
    inventoryId,
    inventoryCode,
    inventoryDate,
    inventoryNumber,
    inventoryObjects
  }: CreateInventoryData) {
    return await doTransaction(async (session: TransactionSession) => {
      const eventService = this.eventService.withSession(session);
      const inventoryService = this.inventoryService.withSession(session);
      const inventoryObjectService = this.inventoryObjectService.withSession(session);

      await eventService.assertExist(eventId);

      const event = await eventService.getById(eventId);
      const existInventory = await inventoryService.getByIdAndEvent(inventoryId, eventId);

      if (
        existInventory &&
        existInventory.status === InventoryStatus.CLOSED &&
        existInventory.auditSessionId
      ) {
        throw new AuditRoomAlreadyClosed();
      }

      if (
        existInventory &&
        existInventory.status === InventoryStatus.AVAILABLE &&
        existInventory.auditSessionId
      ) {
        const link = await this.getAuditJoinLink(existInventory.auditSessionId);

        return {
          auditId: existInventory.auditSessionId,
          auditLink: link,
          users: getRegisteredParticipants(event.participants)
        };
      }

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

      this.assertContaintModerator(registeredAndNotBlockedParticipants);

      const createdInventory = await inventoryService.create({
        eventId,
        id: inventoryId,
        name: InventoryCodes[inventoryCode].name,
        code: inventoryCode,
        number: inventoryNumber,
        shortName: InventoryCodes[inventoryCode].shortName,
        date: inventoryDate ? getDateFromString(inventoryDate) : null,
        isProcessed: false
      });

      const intentoryObjectPromises = inventoryObjects.map(async (object: any) =>
        inventoryObjectService.create({
          ...mapToInventoryObject(inventoryCode, object),
          inventoryId: createdInventory.id
        })
      );

      const participants = _.values(
        _.chain(registeredAndNotBlockedParticipants)
          .groupBy('tabelNumber')
          .mapObject((value: ParticipantWithUser[]) =>
            value.length > 1
              ? value.find((o) => o.role === UserRole.CHAIRMAN) || value[0]
              : value[0]
          )
          .value()
      );

      await Promise.all(intentoryObjectPromises);

      const conference = await this.ivaService.createConference({
        name: `Видеоинвентаризация по описи №${inventoryNumber}`,
        description: 'Видеоинвентаризация',
        owner: { profileId: process.env.TECHNICAL_SPEAKER_IVA_PROFILE_ID as string },
        conferenceTemplateId: '471f7e4e-15b7-48fc-bf34-88488b4e14dc',
        settings: {
          joinRestriction: 'INVITED',
          attendeePermissions: [
            'SPEAKER_OTHER',
            'CHAT_SEND_WITHOUT_PREMODERATION',
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
            { key: 'ALWAYS_SHOW_PARTICIPANT_IN_STAGE', value: false }
          ]
        },
        participants: participants.map(({ user, role }) => ({
          interlocutor: { profileId: user.ivaProfileId as string },
          roles: [IvaRolesMapper[role]],
          interpreterLanguagesPair: ['RUSSIAN']
        })),
        guestPasscode: generatePassword(8)
      });
      const link = await this.getAuditJoinLink(conference.conferenceSessionId);

      await inventoryService.update(inventoryId, {
        auditRoomInviteLink: link,
        auditSessionId: conference.conferenceSessionId
      });

      return {
        auditId: conference.conferenceSessionId,
        auditLink: link,
        users: getRegisteredParticipants(event.participants)
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

      const inventory = await inventoryService.getByIdAndEventId(inventoryId, eventId);

      if (!inventory.auditSessionId) {
        throw new AuditRoomIsNotOpened({
          detail: `Audit room with id (${inventoryId}) is not opened`
        });
      }

      await inventoryService.update(inventoryId, { status: InventoryStatus.CLOSED });

      if (await this.isAllClosedInventories(eventId, inventoryService)) {
        await eventService.update(eventId, { status: EventStatus.CLOSED });
      }
    });
  }

  private async isAllClosedInventories(
    eventId: string,
    inventoryService: InventoryService
  ) {
    const inventories = await inventoryService.findBy({ eventId });

    return inventories.every((inventory) => inventory.status === InventoryStatus.CLOSED);
  }

  private assertContaintModerator(participants: ParticipantWithUser[]) {
    const isContainModerator = participants.some(
      ({ role }) => IvaRolesMapper[role] === IvaRoles.MODERATOR
    );

    if (!isContainModerator) {
      throw new ParticipantsMustContainModeratorError();
    }
  }
}
