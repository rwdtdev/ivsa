import { NextRequest, NextResponse } from 'next/server';
import { getErrorResponse } from '@/lib/helpers';
import { CheckTabelNumbersSchema } from './validation';
import { AccountManager } from '@/core/account/AccountManager';
import { UserService } from '@/core/user/UserService';
import { ActionService } from '@/core/action/ActionService';
import { ActionStatus, ActionType } from '.prisma/client';
import { INITIATORS } from '@/constants';
import { getClientIP } from '@/lib/helpers/ip';

export async function POST(req: NextRequest) {
  const ip = getClientIP(req);
  const userService = new UserService();
  const accountManager = new AccountManager(userService);
  const actionService = new ActionService();

  try {
    const { tabelNumbers } = CheckTabelNumbersSchema.parse(await req.json());
    const existing = await accountManager.getExistingTabelNumbers(tabelNumbers);

    actionService.add({
      type: ActionType.SOI_CHECK_USERS,
      status: ActionStatus.SUCCESS,
      initiator: INITIATORS.SOI,
      ip
    });
    return NextResponse.json(existing, { status: 200 });
  } catch (error) {
    actionService.add({
      type: ActionType.SOI_CHECK_USERS,
      status: ActionStatus.SUCCESS,
      initiator: INITIATORS.SOI,
      ip
    });
    return getErrorResponse(error, req);
  }
}
