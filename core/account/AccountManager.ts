import { UserStatus } from '@prisma/client';
import { UserService } from '../user/UserService';

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
        expiresAt,
        isBlocked: status === UserStatus.BLOCKED || expiresAt.getTime() < Date.now()
      }))
    };
  }
}
