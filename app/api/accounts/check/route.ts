import { NextResponse } from 'next/server';
import { getErrorResponse } from '@/lib/helpers';
import { CheckTabelNumbersSchema } from './validation';
import { AccountManager } from '@/core/account/AccountManager';
import { UserService } from '@/core/user/UserService';

export async function POST(req: Request) {
  const userService = new UserService();
  const accountManager = new AccountManager(userService);

  try {
    const { tabelNumbers } = CheckTabelNumbersSchema.parse(await req.json());

    const existing = await accountManager.getExistingTabelNumbers(tabelNumbers);

    return NextResponse.json(existing, { status: 200 });
  } catch (error) {
    return getErrorResponse(error, req);
  }
}
