import prisma from '@/core/prisma';
import { TransactionSession } from '@/types/prisma';
import { Action, PrismaClient } from '@prisma/client';
import { ActionCreateData } from './types';

export class ActionService {
  private prisma: PrismaClient | TransactionSession;

  constructor(transactionSession?: TransactionSession) {
    this.prisma = transactionSession || prisma;
  }

  withSession(session: TransactionSession) {
    return new ActionService(session);
  }

  async add(data: ActionCreateData): Promise<Action> {
    // @ts-expect-error Wrong generate Json type for nullable value (Prisma can't generate JsonValue with null)
    const action = await this.prisma.action.create({ data });

    return action;
  }

  async getAll() {
    return this.prisma.action.findMany();
  }
}
