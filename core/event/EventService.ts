import _ from 'underscore';
import prisma from '@/core/prisma';
import { TransactionSession } from '@/types/prisma';
import { ParticipantRole, PrismaClient, UserRole } from '@prisma/client';
import {
  EventView,
  EventWithIncludeFileds,
  EventsGetData,
  UpdateEventDataExtended
} from './types';
import { PaginatedResponse } from '@/types';
import moment from 'moment';
import { EventNotFoundError } from './errors';
import { SoiParticipantRoles } from '@/constants/mappings/soi';
import { CreateEventData } from '@/app/api/events/validation';
import { getDateFromString } from '@/utils';

const defaultLimit = 100;

const serializeToView = (event: EventWithIncludeFileds): EventView => {
  return {
    ...event,
    participants: event.participants || [],
    inventories: event.inventories || [],
    startAt: moment(event.startAt).toISOString(),
    endAt: moment(event.endAt).toISOString(),
    commandDate: moment(event.commandDate).toISOString(),
    orderDate: moment(event.orderDate).toISOString()
  };
};

export class EventService {
  private prisma: PrismaClient | TransactionSession;

  constructor(session?: TransactionSession) {
    this.prisma = session || prisma;
  }

  withSession(session: TransactionSession) {
    return new EventService(session);
  }

  async assertExist(id: string) {
    const count = await this.prisma.event.count({ where: { id } });

    if (!count || count === 0) {
      throw new EventNotFoundError({ detail: `Event with id (${id}) not found` });
    }
  }

  async getById(id: string): Promise<EventView> {
    const event = await this.prisma.event.findFirst({
      where: { id },
      include: {
        inventories: true,
        participants: {
          include: { user: true },
          orderBy: { userId: { sort: 'desc', nulls: 'last' } }
        }
      }
    });

    if (!event) {
      throw new EventNotFoundError({ detail: `Event with id (${id}) not found` });
    }

    // @ts-expect-error user cannot be undefined in participant array
    return serializeToView(event);
  }

  async create(data: CreateEventData) {
    const existEvent = await this.prisma.event.findFirst({
      where: { orderId: data.orderId },
      include: { participants: { include: { user: true } } }
    });

    // @ts-expect-error user cannot be undefined in participant array
    if (existEvent) return serializeToView(existEvent);

    const participantPromises = data.participants.map(async (participant) => {
      const user = await this.prisma.user.findFirst({
        where: { tabelNumber: participant.tabelNumber }
      });

      return {
        userId: (user && user.id) || null,
        tabelNumber: (user && user.tabelNumber) || participant.tabelNumber,
        role:
          SoiParticipantRoles[participant.roleId as keyof typeof SoiParticipantRoles] ||
          ParticipantRole.PARTICIPANT
      };
    });

    const participants = await Promise.all(participantPromises);

    const event = await this.prisma.event.create({
      data: {
        ..._.omit(
          {
            ...data,
            startAt: getDateFromString(data.auditStart),
            endAt: getDateFromString(data.auditEnd),
            orderDate: getDateFromString(data.orderDate),
            commandDate: getDateFromString(data.commandDate)
          },
          'auditStart',
          'auditEnd'
        ),
        participants: { create: participants }
      },
      include: { participants: { include: { user: true } } }
    });

    // @ts-expect-error user cannot be undefined in participant array
    return serializeToView(event);
  }

  async update(id: string, data: UpdateEventDataExtended) {
    const updatedEvent = await this.prisma.event.update({
      data: {
        ..._.omit(
          {
            ...data,
            ...(data.auditStart && { startAt: getDateFromString(data.auditStart) }),
            ...(data.auditEnd && { endAt: getDateFromString(data.auditEnd) }),
            ...(data.orderDate && { orderDate: getDateFromString(data.orderDate) }),
            ...(data.commandDate && { startAt: getDateFromString(data.commandDate) })
          },
          'auditStart',
          'auditEnd'
        )
      },
      where: { id }
    });

    return serializeToView(updatedEvent);
  }

  async getEvents(eventsGetData: EventsGetData): Promise<PaginatedResponse<EventView>> {
    const { page = 1, limit = defaultLimit, filter, sort } = eventsGetData;

    const conditions = [];

    if (filter) {
      if (filter.statuses) {
        conditions.push({ status: { in: filter.statuses } });
      }

      if (filter.briefingStatuses) {
        conditions.push({ briefingStatus: { in: filter.briefingStatuses } });
      }

      if (filter.userId) {
        conditions.push({ participants: { some: { userId: filter.userId } } });
      }
    }

    const where = {
      where: {
        ...(filter && filter.from && { endAt: { gte: filter.from } }),
        ...(filter && filter.to && { startAt: { lte: filter?.to } }),
        ...(conditions.length > 0 && { AND: conditions })
      }
    };

    const totalCount = await prisma.event.count({ ...where });

    const events = await prisma.event.findMany({
      ...where,
      include: {
        participants: { include: { event: true, user: true } },
        inventories: true
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sort.by]: sort.direction }
    });

    return {
      // @ts-expect-error user cannot be undefined in participant array
      items: events.map((event) => serializeToView(event)),
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
