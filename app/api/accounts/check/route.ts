import { NextRequest, NextResponse } from 'next/server';
import { getErrorResponse, getUnknownErrorText } from '@/lib/helpers';
import { CheckTabelNumbersSchema } from './validation';
import { AccountManager } from '@/core/account/AccountManager';
import { UserService } from '@/core/user/UserService';
import { ActionService } from '@/core/action/ActionService';
import { ActionStatus } from '.prisma/client';
import { getClientIP } from '@/lib/helpers/ip';

export async function POST(req: NextRequest) {
  const ip = getClientIP(req);
  const userService = new UserService();
  const accountManager = new AccountManager(userService);
  const actionService = new ActionService();

  try {
    const { tabelNumbers } = CheckTabelNumbersSchema.parse(await req.json());
    const existing = await accountManager.getExistingTabelNumbers(tabelNumbers);

    await actionService.addAccountsCheckActionLog(ip, ActionStatus.SUCCESS, {
      tabelNumbers
    });

    return NextResponse.json(existing, { status: 200 });
  } catch (error) {
    await actionService.addAccountsCheckActionLog(ip, ActionStatus.ERROR, {
      error: getUnknownErrorText(error)
    });

    return getErrorResponse(error, req);
  }
}
