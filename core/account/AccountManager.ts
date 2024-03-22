import { UserStatus } from '@prisma/client';
import { UserService } from '../user/UserService';
import { toUTCDatetime } from '@/lib/helpers/dates';

export class AccountManager {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async getExistingTabelNumbers(tabelNumbers: string[]) {
    const { total, items } = await this.userService.getByTabelNumbers(tabelNumbers);

    return {
      total,
      users: items.map(({ tabelNumber, expiresAt, status }) => ({
        tabelNumber,
        expiresAt: toUTCDatetime(expiresAt),
        isRecused: status === UserStatus.RECUSED,
        isBlocked: status === UserStatus.BLOCKED || expiresAt.getTime() < Date.now()
      }))
    };
  }
}
