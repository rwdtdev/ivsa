import { SortOrder } from '@/constants/data';
import ApiError from '@/server/utils/error';
import { TransactionSession } from '@/types/prisma';
import { Event, PrismaClient } from '@prisma/client';
import { EventView, EventsGetData } from './types';
import { PaginatedResponse } from '@/server/types';
import { exclude } from '@/server/utils/exclude';
import moment from 'moment';
import { DATETIME_FORMAT, DATE_FORMAT } from '@/constants/date';

const defaultLimit = 100;

export class EventService {
  private prisma: PrismaClient | TransactionSession;

  constructor(transactionSession?: TransactionSession) {
    this.prisma = transactionSession ?? prisma;
  }

  static withSession(session: TransactionSession) {
    return new this(session);
  }

  assertExist = async (id: string): Promise<void> => {
    const count = await this.prisma.event.count({ where: { id } });

    if (!count || count === 0) {
      throw new ApiError(`Event with id (${id}) not found`, 404);
    }
  };

  async getEventById(id: string) {
    const event = await this.prisma.event.findFirst({ where: { id } });

    if (!event) {
      throw new ApiError(`Event with id (${id}) not found`, 404);
    }

    return event;
  }

  async getEvents(
    eventsGetData: EventsGetData = {}
  ): Promise<PaginatedResponse<EventView>> {
    const {
      page = 1,
      limit = defaultLimit,
      searchTerm,
      sortDirection = SortOrder.Descending,
      query
    } = eventsGetData;

    console.log('QUERY: ', query);

    const where = {
      where: {
        ...(query && query.from && { startAt: { gte: query.from } }),
        ...(query && query.to && { endAt: { lte: query?.to } }),
        type: query?.type
      }
    };

    // @ts-ignore
    const totalCount = await prisma.event.count({ ...where });

    console.log('COUNT: ', totalCount);

    // @ts-ignore
    const events = await prisma.event.findMany({
      ...where,
      include: {
        participants: {
          include: {
            organisation: true,
            department: true
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
