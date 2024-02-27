import _ from 'underscore';
import IvaAPI from '@/server/services/iva/api';
import { NextRequest, NextResponse } from 'next/server';
import { getErrorResponse } from '@/lib/helpers';
import { doTransaction } from '@/lib/prisma-transaction';
import { TransactionSession } from '@/types/prisma';
import { EventService } from '@/server/services/events';
import { InventoryService } from '@/server/services/inventories';
import { BriefingStatus } from '@prisma/client';
import { IvaRolesMapper } from '@/constants/mappings/iva';
import { BriefingRoomIsStillOpenError } from './errors';

export async function POST(request: NextRequest) {
  const reqBody = await request.json();
  const eventId = reqBody.eventId;
  const inventoryId = reqBody.inventoryId;
  const inventoryNumber = reqBody.inventoryNumber;
  // TODO Not have field specification
  const inventoryContainerObject = reqBody.inventoryContainerObject;

  let conferenceSessionId;

  try {
    const inventoryDate = new Date(Date.parse(reqBody.inventoryDate));

    return await doTransaction(async (txSession: TransactionSession) => {
      const eventServiceWithSession = EventService.withSession(txSession);
      const intentoryServiceWithSession = InventoryService.withSession(txSession);

      await eventServiceWithSession.assertExist(eventId);
      await intentoryServiceWithSession.assertNotExist(inventoryId);

      const event = await eventServiceWithSession.getEventById(eventId);

      if (event.briefingStatus === BriefingStatus.IN_PROGRESS) {
        throw new BriefingRoomIsStillOpenError();
      }

      await intentoryServiceWithSession.create({
        eventId,
        id: inventoryId,
        date: inventoryDate,
        number: inventoryNumber
      });

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
        participants: event.participants.map(({ user, role }) => ({
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

      console.log(participants);

      const link = participants.data[0].joinLink;

      await intentoryServiceWithSession.update(inventoryId, {
        auditRoomInviteLink: link,
        auditSessionId: conferenceSessionId
      });

      return NextResponse.json(
        {
          auditId: conferenceSessionId,
          auditLink: link
        },
        { status: 201 }
      );
    });
  } catch (error) {
    if (conferenceSessionId) {
      await IvaAPI.conferenceSessions.closeRoom(conferenceSessionId);
    }

    return getErrorResponse(error);
  }
}
