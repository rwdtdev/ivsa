import { NextResponse } from 'next/server';
import { getErrorResponse } from '@/lib/helpers';
import { CheckTabelNumbersSchema } from './validation';
import { AccountManager } from '@/core/account/AccountManager';
import { UserService } from '@/core/user/UserService';
import { assertAPICallIsAuthorized } from '@/lib/api/helpers';

export async function POST(request: Request) {
  const userService = new UserService();
  const accountManager = new AccountManager(userService);

  try {
    assertAPICallIsAuthorized(request);

    const { tabelNumbers } = CheckTabelNumbersSchema.parse(await request.json());

    const existing = await accountManager.getExistingTabelNumbers(tabelNumbers);

    return NextResponse.json(existing, { status: 200 });
  } catch (error) {
    return getErrorResponse(error);
  }
}
