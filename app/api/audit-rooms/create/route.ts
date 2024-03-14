import _ from 'underscore';
import IvaAPI from '@/server/services/iva/api';
import { NextRequest, NextResponse } from 'next/server';
import { getErrorResponse } from '@/lib/helpers';
import { doTransaction } from '@/lib/prisma-transaction';
import { TransactionSession } from '@/types/prisma';
import { EventService } from '@/server/services/events';
import { InventoryService } from '@/server/services/inventories';
import { BriefingStatus, UserStatus } from '@prisma/client';
import { IvaRolesMapper } from '@/constants/mappings/iva';
import { BriefingRoomIsStillOpenError, EmptyPartisipantsListError } from './errors';
import { CreateInventorySchema } from './validation';
import { mapToInventoryObject } from '@/server/services/inventories/mappers/InventoryObjectsMapper';
import { getDateFromString } from '@/server/utils';
import { InventoryCodes } from '@/server/services/inventories/types';
import { InventoryObjectService } from '@/server/services/inventoryObjects';

export async function POST(request: NextRequest) {
  let conferenceSessionId;

  try {
    const {
      eventId,
      inventoryId,
      inventoryCode,
      inventoryDate,
      inventoryNumber,
      inventoryObjects
    } = CreateInventorySchema.parse(await request.json());

    return await doTransaction(async (txSession: TransactionSession) => {
      const eventServiceWithSession = EventService.withSession(txSession);
      const intentoryServiceWithSession = InventoryService.withSession(txSession);
      const inventoryObjectServiceWithSession =
        InventoryObjectService.withSession(txSession);

      await eventServiceWithSession.assertExist(eventId);
      await intentoryServiceWithSession.assertNotExist(inventoryId);

      const event = await eventServiceWithSession.getEventById(eventId);

      if (event.briefingStatus === BriefingStatus.IN_PROGRESS) {
        throw new BriefingRoomIsStillOpenError();
      }

      if (!event.participants || _.isEmpty(event.participants)) {
        throw new EmptyPartisipantsListError();
      }

      const registeredIvaUsers = event.participants.filter(
        ({ user }) => user && user.ivaProfileId
      );

      if (_.isEmpty(registeredIvaUsers)) {
        throw new EmptyPartisipantsListError();
      }

      const inventory = await intentoryServiceWithSession.create({
        eventId,
        id: inventoryId,
        name: InventoryCodes[inventoryCode].name,
        code: inventoryCode,
        number: inventoryNumber,
        shortName: InventoryCodes[inventoryCode].shortName,
        date: getDateFromString(inventoryDate)
      });

      const intentoryObjectPromises = inventoryObjects.map(async (object: any) =>
        inventoryObjectServiceWithSession.create({
          ...mapToInventoryObject(inventoryCode, object),
          inventoryId: inventory.id
        })
      );

      await Promise.all(intentoryObjectPromises);

      const speakerIvaProfileId =
        eventServiceWithSession.assertSpeakerExistAndRegisteredInIva(event);

      const createdRoom = await IvaAPI.conferenceSessions.createRoom({
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
        participants: registeredIvaUsers.map(({ user, role }) => ({
          interlocutor: { profileId: user.ivaProfileId as string },
          roles: [IvaRolesMapper[role]],
          interpreterLanguagesPair: ['RUSSIAN']
        }))
      });

      conferenceSessionId = createdRoom.conferenceSessionId;

      const participants = await IvaAPI.conferenceSessions.findParticipants(
        conferenceSessionId,
        { requestedData: ['JOIN_LINK'] }
      );

      const link = participants.data[0].joinLink;

      await intentoryServiceWithSession.update(inventoryId, {
        auditRoomInviteLink: link,
        auditSessionId: conferenceSessionId
      });

      return NextResponse.json(
        {
          auditId: conferenceSessionId,
          auditLink: link,
          users: event.participants
            .filter(({ user }) => user)
            .map(({ user }) => ({
              tabelNumber: user.tabelNumber,
              expiresAt: new Date(), // TODO заменить на поле из БД
              isBlocked: user.status === UserStatus.BLOCKED
            }))
        },
        { status: 201 }
      );
    });
  } catch (error) {
    if (conferenceSessionId) {
      await IvaAPI.conferenceSessions.closeRoom(conferenceSessionId);
    }

    console.log(error);

    return getErrorResponse(error);
  }
}
