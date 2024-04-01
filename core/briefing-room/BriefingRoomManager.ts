import _ from 'underscore';
import { doTransaction } from '@/lib/prisma-transaction';
import { TransactionSession } from '@/types/prisma';
import {
  BriefingAlreadyEndError,
  BriefingRoomAlreadyExistError,
  BriefingRoomIsNotOpened,
  EventParticipantsMustBeNotEmptyError
} from './errors';
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
    const participants = await this.ivaService.findConferenceParticipants(
      conferenceSessionId,
      { requestedData: ['JOIN_LINK'] }
    );

    return participants[0].joinLink;
  }

  async createRoom({ eventId }: CreateBriefingRoomData) {
    return await doTransaction(async (session: TransactionSession) => {
      const eventService = this.eventService.withSession(session);
      const event = await eventService.getById(eventId);

      if (event.briefingStatus === BriefingStatus.IN_PROGRESS) {
        throw new BriefingRoomAlreadyExistError();
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

      const speaker = registeredAndNotBlockedParticipants.find(
        ({ role }) => IvaRolesMapper[role] === IvaRoles.SPEAKER
      );

      const speakerIvaProfileId = eventService.validateSpeakerAndGetIvaProfileId(speaker);

      const conference = await this.ivaService.createConference({
        name: `Видеоинструктаж по событию инвентаризации`,
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

    if (event.briefingStatus === BriefingStatus.PASSED) {
      throw new BriefingAlreadyEndError();
    }

    if (!event.briefingSessionId) {
      throw new BriefingRoomIsNotOpened();
    }

    await this.ivaService.closeConference(event.briefingSessionId);

    await this.eventService.update(eventId, {
      briefingStatus: BriefingStatus.PASSED,
      briefingRoomInviteLink: null,
      briefingSessionId: null
    });
  }
}
