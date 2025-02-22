import _ from 'underscore';
import { UserCreateData, UserUpdateData, UserView } from './types';
import { IvaService } from '../iva/IvaService';
import { ParticipantService } from '../participant/ParticipantService';
import { UserService } from './UserService';
import { doTransaction } from '@/lib/prisma-transaction';
import { TransactionSession } from '@/types/prisma';
import { ActionStatus, ActionType, User, UserRole, UserStatus } from '@prisma/client';
import {
  UnblockIvaUserError,
  BlockIvaUserError,
  CreateIvaUserError,
  UserNotRegisteredInIvaError,
  Iva
} from './errors';
import { getMonitoringInitData } from '@/lib/getMonitoringInitData';
import { ActionService } from '../action/ActionService';
import { IvaUserUpdData } from '../iva/types';

export class UserManager {
  private ivaService: IvaService;
  private userService: UserService;
  private participantService: ParticipantService;

  constructor(
    ivaService: IvaService,
    userService: UserService,
    participantService: ParticipantService
  ) {
    this.ivaService = ivaService;
    this.userService = userService;
    this.participantService = participantService;
  }

  async createUser(data: UserCreateData): Promise<UserView> {
    const {
      name,
      username,
      email,
      phone,
      role,
      status,
      tabelNumber,
      password,
      expiresAt,
      ASOZSystemRequestNumber
    } = data;

    return await doTransaction(async (session: TransactionSession) => {
      const userService = this.userService.withSession(session);
      const participantService = this.participantService.withSession(session);

      await userService.assertNotExistWithEmail(email);
      await userService.assertNotExistWithUsername(username);
      await userService.assertNotExistWithTabelNumber(tabelNumber);

      const ivaResponse = await this.ivaService.createUser({
        login: username,
        userType: role === UserRole.ADMIN ? UserRole.ADMIN : UserRole.USER,
        securityLevel: 'UNCLASSIFIED',
        name,
        email: { value: email, privacy: 'AUTHORIZED' },
        phone: { value: phone, privacy: 'AUTHORIZED' },
        password,
        isConferenceCreationEnabled: true
      });

      if (!ivaResponse.profileId) {
        throw new CreateIvaUserError();
      }

      try {
        const user = await userService.create({
          name,
          username,
          email,
          phone,
          status,
          role,
          tabelNumber,
          ivaProfileId: ivaResponse.profileId,
          password,
          ASOZSystemRequestNumber,
          expiresAt
        });

        await this.updateParticipantsUser(user, participantService);

        return _.omit(user, 'passwordHashes', 'password');
      } catch (error) {
        await this.ivaService.removeUser(ivaResponse.profileId);

        throw new CreateIvaUserError({
          detail: `Problems occurred during the user (${username}:${tabelNumber}) save process in ASVI.`
        });
      }
    });
  }

  async updateUser(id: string, data: UserUpdateData): Promise<UserView> {
    return await doTransaction(async (session: TransactionSession) => {
      const userService = this.userService.withSession(session);

      const user = await userService.getById(id);

      if (data.email) {
        await userService.assertNotExistWithEmail(data.email);
      }
      if (data.username) {
        await userService.assertNotExistWithUsername(data.username);
      }
      if (data.tabelNumber) {
        await userService.assertNotExistWithTabelNumber(data.tabelNumber);
      }

      if (
        user.ivaProfileId &&
        data &&
        (data.username || data.name || data.password || data.phone || data.email)
      ) {
        const updData: IvaUserUpdData = { userType: 'USER' };
        if (data.username) updData.login = data.username;
        if (data.name) updData.name = data.username;
        if (data.email) updData.email = { value: data.email };
        if (data.phone) updData.phone = { value: data.phone };
        if (data.password) updData.password = data.password;
        try {
          await this.ivaService.updateUser(
            user.ivaProfileId,
            // _.pick(data, 'username', 'password', 'phone', 'email', 'name')
            updData
          );
        } catch (err) {
          throw new Iva.UpdateUserError();
        }
      }

      return await userService.update(user.id, data);
    });
  }

  async blockUser({ id, type }: { id: string; type: ActionType }) {
    const monitorInitData = await getMonitoringInitData();
    const actionService = new ActionService();
    try {
      await this.userService.assertExist(id);
      const user = await this.userService.getById(id);

      if (!user.ivaProfileId) {
        throw new UserNotRegisteredInIvaError();
      }

      await this.ivaService.blockUser(user.ivaProfileId);
      await this.userService.update(id, { status: UserStatus.BLOCKED });
      await actionService.add({
        ip: monitorInitData.ip,
        initiator: monitorInitData.initiator,
        type,
        status: ActionStatus.SUCCESS,
        details: {
          adminUsername: monitorInitData.initiator,
          editedUserUsername: user.username,
          editedUserName: user.name
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        await actionService.add({
          ip: monitorInitData.ip,
          initiator: monitorInitData.initiator,
          type,
          status: ActionStatus.ERROR,
          details: {
            editedUserId: id,
            error: `Problems occurred during block user with id (${id}) in IVA R. ${error.message}`
          }
        });
      }
      throw new BlockIvaUserError({
        detail: `Problems occurred during block user with id (${id}) in IVA R. ${error}`
      });
    }
  }

  async unblockUser(id: string) {
    const monitorInitData = await getMonitoringInitData();
    const actionService = new ActionService();
    try {
      await this.userService.assertExist(id);
      const user = await this.userService.getById(id);

      if (!user.ivaProfileId) {
        throw new UserNotRegisteredInIvaError();
      }

      await this.ivaService.unblockUser(user.ivaProfileId);
      await this.userService.update(id, { status: UserStatus.ACTIVE });
      await actionService.add({
        ip: monitorInitData.ip,
        initiator: monitorInitData.initiator,
        type: ActionType.ADMIN_USER_UNBLOCK,
        status: ActionStatus.SUCCESS,
        details: {
          adminUsername: monitorInitData.initiator,
          editedUserUsername: user.username,
          editedUserName: user.name
        }
      });
    } catch (error) {
      throw new UnblockIvaUserError({
        detail: `Problems occurred during unblock user with id (${id}) in IVA R. ${error}`
      });
    }
  }

  async updateParticipantsUser(
    { id, tabelNumber }: Pick<User, 'id' | 'tabelNumber'>,
    participantService: ParticipantService
  ) {
    const isHaveNotRegistered = await participantService.isHaveNotRegistered(tabelNumber);

    if (isHaveNotRegistered) {
      await participantService.linkParticipantsWithUser(id, tabelNumber);
    }
  }

  async getAll() {
    return this.userService.getAll();
  }
}
