import _ from 'underscore';
import { NextRequest, NextResponse } from 'next/server';
import IvaAPI from '@/server/services/iva/api';
import { EventService } from '@/server/services/events';
import { BriefingStatus } from '@prisma/client';
import { doTransaction } from '@/lib/prisma-transaction';
import { TransactionSession } from '@/types/prisma';
import { getErrorResponse } from '@/lib/helpers';
import { BriefingRoomAlreadyExist } from './errors';
import { IvaRolesMapper } from '@/constants/mappings/iva';

export async function POST(request: NextRequest) {
  const reqBody = await request.json();
  const eventId = reqBody.eventId;

  let conferenceSessionId;

  try {
    return await doTransaction(async (txSession: TransactionSession) => {
      const eventServiceWithSession = EventService.withSession(txSession);

      await eventServiceWithSession.assertExist(eventId);

      const event = await eventServiceWithSession.getEventById(eventId);

      if (event.briefingSessionId) {
        throw new BriefingRoomAlreadyExist();
      }

      const speakerIvaProfileId =
        eventServiceWithSession.assertSpeakerExistAndRegisteredInIva(event);

      const createdRoom = await IvaAPI.conferenceSessions.createRoom({
        name: `Видеоинструктаж по событию ${event.id}`,
        description: 'Видеоинструктаж по событию инвентаризации',
        owner: { profileId: speakerIvaProfileId },
        conferenceTemplateId: '471f7e4e-15b7-48fc-bf34-88488b4e14dc',
        settings: {
          joinRestriction: 'INVITED_OR_REGISTERED',
          attendeePermissions: [
            'SPEAKER_OTHER',
            'CHAT_SEND_WITHOUT_PREMODERATION',
            'INVITING_PARTICIPANTS',
            'PUBLISH_MESSAGES_IN_CHAT',
            'RECEIVE_MEDIA'
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

      const link = participants.data[0].joinLink;

      await eventServiceWithSession.update(eventId, {
        briefingStatus: BriefingStatus.IN_PROGRESS,
        briefingRoomInviteLink: link,
        briefingSessionId: conferenceSessionId
      });

      return NextResponse.json(
        {
          briefingId: conferenceSessionId,
          briefingLink: link
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
