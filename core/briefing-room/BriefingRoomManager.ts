import _ from 'underscore';
import { doTransaction } from '@/lib/prisma-transaction';
import { TransactionSession } from '@/types/prisma';
import { EventParticipantsMustBeNotEmptyError } from './errors';
import { BriefingStatus, UserStatus } from '@prisma/client';

import { IvaService } from '../iva/IvaService';
import { IvaRoles, IvaRolesMapper } from '@/constants/mappings/iva';
import { CloseBriefingRoomData } from '@/app/api/briefing-rooms/close/validation';
import { CreateBriefingRoomData } from '@/app/api/briefing-rooms/create/validation';
import { EventService } from '../event/EventService';
import { ParticipantWithUser } from '../event/types';
import { getRegisteredParticipants } from '@/lib/helpers/responses';

export class BriefingRoomManager {
  private ivaService: IvaService;
  private eventService: EventService;

  constructor(ivaService: IvaService, eventService: EventService) {
    this.ivaService = ivaService;
    this.eventService = eventService;
  }

  async getBriefingJoinLink(conferenceSessionId: string): Promise<string> {
    const { protocol, hostname, port } = new URL(process.env.IVA_API_URL as string);

    return `${protocol}//${hostname}${port ? ':' + port : ''}/#join:s${conferenceSessionId}`;

    // const participants = await this.ivaService.findConferenceParticipants(
    //   conferenceSessionId,
    //   { requestedData: ['JOIN_LINK'] }
    // );

    // return participants[0].joinLink;
  }

  async createRoom({ eventId }: CreateBriefingRoomData) {
    return await doTransaction(async (session: TransactionSession) => {
      const eventService = this.eventService.withSession(session);
      const event = await eventService.getById(eventId);

      if (
        event &&
        event.briefingStatus === BriefingStatus.IN_PROGRESS &&
        event.briefingSessionId
      ) {
        const link = await this.getBriefingJoinLink(event.briefingSessionId);

        return {
          briefingId: event.briefingSessionId,
          briefingLink: link,
          users: getRegisteredParticipants(event.participants)
        };
      }

      if (_.isEmpty(event.participants)) {
        throw new EventParticipantsMustBeNotEmptyError();
      }

      const registeredAndNotBlockedParticipants = event.participants.filter(
        ({ user }: ParticipantWithUser) =>
          user &&
          user.ivaProfileId &&
          user.status !== UserStatus.BLOCKED &&
          user.status !== UserStatus.RECUSED
      );

      const conference = await this.ivaService.createConference({
        name: `Видеоинструктаж по событию инвентаризации`,
        description: 'Видеоинструктаж по событию инвентаризации',
        owner: { profileId: process.env.TECHNICAL_SPEAKER_IVA_PROFILE_ID as string },
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
        participants: registeredAndNotBlockedParticipants.map(({ user, role }) => ({
          interlocutor: { profileId: user.ivaProfileId as string },
          roles: [IvaRolesMapper[role]],
          interpreterLanguagesPair: ['RUSSIAN']
        }))
      });

      const link = await this.getBriefingJoinLink(conference.conferenceSessionId);

      await eventService.update(eventId, {
        briefingStatus: BriefingStatus.IN_PROGRESS,
        briefingRoomInviteLink: link,
        briefingSessionId: conference.conferenceSessionId
      });

      return {
        briefingId: conference.conferenceSessionId,
        briefingLink: link,
        users: getRegisteredParticipants(event.participants)
      };
    });
  }

  async closeConference(conferenceSessionId: string) {
    await this.ivaService.closeConference(conferenceSessionId);
  }

  async closeRoom({ eventId }: CloseBriefingRoomData) {
    await this.eventService.assertExist(eventId);

    const event = await this.eventService.getById(eventId);

    if (!event.briefingSessionId) return;

    await this.ivaService.closeConference(event.briefingSessionId);

    await this.eventService.update(eventId, {
      briefingStatus: BriefingStatus.PASSED,
      briefingRoomInviteLink: null,
      briefingSessionId: null
    });
  }
}
