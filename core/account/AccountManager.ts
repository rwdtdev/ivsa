import { UserStatus } from '@prisma/client';
import { UserService } from '../user/UserService';
import moment from 'moment';
import { ISO_DATETIME_FORMAT } from '@/constants/date';

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
        expiresAt: moment(expiresAt).format(ISO_DATETIME_FORMAT),
        isBlocked: status === UserStatus.BLOCKED || expiresAt.getTime() < Date.now()
      }))
    };
  }
}
