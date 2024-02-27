import _ from 'underscore';
import { SortOrder } from '@/constants/data';
import ApiError from '@/server/utils/error';
import prisma from '@/server/services/prisma';
import { TransactionSession } from '@/types/prisma';
import { Event, PrismaClient, User, UserRole } from '@prisma/client';
import { CreateEventData, EventView, EventsGetData } from './types';
import { PaginatedResponse } from '@/server/types';
import { exclude } from '@/server/utils/exclude';
import moment from 'moment';
import { DATETIME_FORMAT, DATE_FORMAT } from '@/constants/date';
import {
  EventMustHaveChairman,
  EventParticipantsMustBeNotEmptyError,
  EventParticipantsMustContainSpeakerError,
  SpeakerIsNotRegisteredInIvaError
} from './errors';
import { SoiParticipantRoles } from '@/constants/mappings/soi';
import { IvaRoles, IvaRolesMapper } from '@/constants/mappings/iva';

const defaultLimit = 100;

const serializeToView = (event: Event): EventView => {
  return {
    ...event,
    startAt: moment(event.startAt).toISOString(),
    endAt: moment(event.endAt).toISOString()
  } as EventView;
};

export class EventService {
  private prisma: PrismaClient | TransactionSession;

  constructor(transactionSession?: TransactionSession) {
    this.prisma = transactionSession ?? prisma;
  }

  static withSession(session: TransactionSession) {
    return new this(session);
  }

  async assertExist(id: string): Promise<void> {
    const count = await this.prisma.event.count({ where: { id } });

    if (!count || count === 0) {
      throw new ApiError(`Event with id (${id}) not found`, 404);
    }
  }

  assertSpeakerExistAndRegisteredInIva(event: EventView): string {
    const { participants } = event;

    if (!participants || _.isEmpty(participants)) {
      throw new EventParticipantsMustBeNotEmptyError();
    }

    const speaker = participants.find(
      ({ role }) => IvaRolesMapper[role] === IvaRoles.SPEAKER
    );

    if (!speaker) {
      throw new EventParticipantsMustContainSpeakerError();
    }

    if (!speaker.user.ivaProfileId) {
      throw new SpeakerIsNotRegisteredInIvaError();
    }

    return speaker.user.ivaProfileId;
  }

  async getEventById(id: string): Promise<EventView> {
    const event = await this.prisma.event.findFirst({
      where: { id },
      include: {
        inventories: true,
        participants: {
          include: { user: true }
        }
      }
    });

    if (!event) {
      throw new ApiError(`Event with id (${id}) not found`, 404);
    }

    return serializeToView(event);
  }

  async create(data: CreateEventData): Promise<EventView> {
    const usersPromises = data.participants.map(async (participant) => {
      const user = await this.prisma.user.findFirst({
        where: {
          tabelNumber: participant.tabelNumber
        }
      });

      return (
        user && {
          userId: user.id,
          role:
            SoiParticipantRoles[participant.roleId as keyof typeof SoiParticipantRoles] ||
            UserRole.PARTICIPANT
        }
      );
    });

    const users = (await Promise.all(usersPromises)).filter(_.identity);

    const event = await this.prisma.event.create({
      data: {
        ...data,
        participants: {
          // @ts-ignore
          create: users
        }
      }
    });

    return serializeToView(event);
  }

  async update(id: string, data: any) {
    const updatedEvent = await this.prisma.event.update({
      where: { id },
      data
    });

    return updatedEvent;
  }

  async getEvents(
    eventsGetData: EventsGetData = {}
  ): Promise<PaginatedResponse<EventView>> {
    const {
      page = 1,
      limit = defaultLimit,
      sortDirection = SortOrder.Descending,
      query
    } = eventsGetData;

    const conditions = [];

    if (query) {
      if (query.statuses) {
        conditions.push({ status: { in: query.statuses } });
      }
    }

    const where = {
      where: {
        ...(query && query.from && { startAt: { gte: query.from } }),
        ...(query && query.to && { endAt: { lte: query?.to } }),
        ...(conditions.length > 0 && { AND: conditions })
      }
    };

    const totalCount = await prisma.event.count({ ...where });

    const events = await prisma.event.findMany({
      ...where,
      include: {
        participants: {
          include: {
            event: true,
            user: true
          }
        }
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: sortDirection
      }
    });

    return {
      items: events.map((event) => ({
        ...event,
        startAt: moment(event.startAt).format(DATETIME_FORMAT),
        endAt: moment(event.endAt).format(DATETIME_FORMAT),
        commandDate: moment(event.commandDate).format(DATE_FORMAT),
        orderDate: moment(event.orderDate).format(DATE_FORMAT)
      })),
      pagination: {
        total: totalCount,
        pagesCount: Math.ceil(totalCount / limit),
        currentPage: page,
        perPage: limit,
        from: (page - 1) * limit + 1,
        to: (page - 1) * limit + events.length,
        hasMore: page < Math.ceil(totalCount / limit)
      }
    };
  }
}

export const excludeFromEvent = (event: Event) => exclude(event);
