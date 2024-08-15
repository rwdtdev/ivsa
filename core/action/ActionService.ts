import prisma from '@/core/prisma';
import { TransactionSession } from '@/types/prisma';
import { Action, ActionStatus, ActionType, PrismaClient } from '@prisma/client';
import { ActionCreateData } from './types';
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
    const res = await this.prisma.action.findMany();
    return res;
  }
}
