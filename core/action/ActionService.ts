import prisma from '@/core/prisma';
import { TransactionSession } from '@/types/prisma';
import { Action, ActionStatus, ActionType, PrismaClient } from '@prisma/client';
import { ActionCreateData, ActionsReqParams } from './types';
import { INITIATORS } from '@/constants';

export class ActionService {
  private prisma: PrismaClient | TransactionSession;

  constructor(transactionSession?: TransactionSession) {
    this.prisma = transactionSession || prisma;
  }

  withSession(session: TransactionSession) {
    return new ActionService(session);
  }

  async add(data: ActionCreateData): Promise<Action> {
    const action = await this.prisma.action.create({ data });

    return action;
  }

  async addAccountsCheckActionLog(
    ip: string | null,
    status: ActionStatus,
    details?: Record<string, any>
  ) {
    await this.add({
      type: ActionType.SOI_CHECK_USERS,
      initiator: INITIATORS.SOI,
      status,
      ip,
      details
    });
  }

  async addOpenAuditRoomActionLog(
    ip: string | null,
    status: ActionStatus,
    details?: Record<string, any>
  ) {
    await this.add({
      type: ActionType.SOI_AUDIT_OPEN,
      initiator: INITIATORS.SOI,
      status,
      ip,
      details
    });
  }

  async addCloseAuditRoomActionLog(
    ip: string | null,
    status: ActionStatus,
    details?: Record<string, any>
  ) {
    await this.add({
      type: ActionType.SOI_AUDIT_CLOSE,
      initiator: INITIATORS.SOI,
      status,
      ip,
      details: details
    });
  }

  async addOpenBriefingRoomActionLog(
    ip: string | null,
    status: ActionStatus,
    details?: Record<string, any>
  ) {
    await this.add({
      type: ActionType.SOI_BRIEFING_OPEN,
      initiator: INITIATORS.SOI,
      status,
      ip,
      details
    });
  }

  async addCloseBriefingRoomActionLog(
    ip: string | null,
    status: ActionStatus,
    details?: Record<string, any>
  ) {
    await this.add({
      type: ActionType.SOI_BRIEFING_CLOSE,
      initiator: INITIATORS.SOI,
      status,
      ip,
      details
    });
  }

  async addCreateEventActionLog(
    ip: string | null,
    status: ActionStatus,
    details?: Record<string, any>
  ) {
    await this.add({
      type: ActionType.SOI_EVENT_CREATE,
      initiator: INITIATORS.SOI,
      status,
      ip,
      details
    });
  }

  async addChangeEventParticipantsActionLog(
    ip: string | null,
    status: ActionStatus,
    details?: Record<string, any>
  ) {
    await this.add({
      type: ActionType.SOI_EVENT_PARTICIPANTS_CHANGE,
      initiator: INITIATORS.SOI,
      status,
      ip,
      details
    });
  }

  async getAll() {
    return await this.prisma.action.findMany();
  }

  async getActionsWithParams(
    params: ActionsReqParams = { sort: { by: 'actionAt', direction: 'desc' } }
  ) {
    const { page = 1, limit = 10, searchTerm, filter, sort } = params;

    const containsSearchTerm = { contains: searchTerm, mode: 'insensitive' };

    const conditions = [];

    if (filter) {
      if (filter.types) {
        conditions.push({ type: { in: filter.types } });
      }
      if (filter.statuses) {
        conditions.push({ status: { in: filter.statuses } });
      }
    }

    const dateTo = filter?.to ? new Date(filter.to) : undefined;
    if (dateTo) dateTo.setDate(dateTo.getDate() + 1);
    const filterTo = dateTo?.toISOString();

    const where = {
      where: {
        ...(searchTerm && {
          OR: [
            { ip: containsSearchTerm },
            { initiator: containsSearchTerm }
            // { details: containsSearchTerm }
          ]
        }),
        ...(filter?.from && { actionAt: { gte: filter.from } }),
        ...(filter?.to && { actionAt: { lt: filterTo } }),
        ...(filter?.from &&
          filter?.to && { actionAt: { gte: filter.from, lt: filterTo } }),
        ...(conditions.length > 0 && { AND: conditions })
      }
    };

    // @ts-expect-error types
    const totalCount = await prisma.action.count({ ...where });

    // @ts-expect-error types
    const actions = await prisma.action.findMany({
      ...where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sort.by || 'actionAt']: sort?.direction || 'desc' }
    });
    return {
      items: actions,
      pagination: {
        total: totalCount,
        pagesCount: Math.ceil(totalCount / limit),
        currentPage: page,
        perPage: limit,
        from: (page - 1) * limit + 1,
        to: (page - 1) * limit + actions.length,
        hasMore: page < Math.ceil(totalCount / limit)
      }
    };
  }
}
