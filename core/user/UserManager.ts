import _ from 'underscore';
import { UserCreateData, UserView } from './types';
import { DepartmentService } from '../department/DepartmentService';
import { IvaService } from '../iva/IvaService';
import { OrganisationService } from '../organisation/OrganisationService';
import { ParticipantService } from '../participant/ParticipantService';
import { UserService } from './UserService';
import { doTransaction } from '@/lib/prisma-transaction';
import { TransactionSession } from '@/types/prisma';
import { ActionStatus, ActionType, User, UserRole, UserStatus } from '@prisma/client';
import {
  UnblockIvaUserError,
  BlockIvaUserError,
  CreateIvaUserError,
  UserNotRegisteredInIvaError
} from './errors';
import { getMonitoringInitData } from '@/lib/getMonitoringInitData';
import { ActionService } from '../action/ActionService';

export class UserManager {
  private ivaService: IvaService;
  private userService: UserService;
  private departmentService: DepartmentService;
  private participantService: ParticipantService;
  private organisationService: OrganisationService;

  constructor(
    ivaService: IvaService,
    userService: UserService,
    departmentService: DepartmentService,
    participantService: ParticipantService,
    organisationService: OrganisationService
  ) {
    this.ivaService = ivaService;
    this.userService = userService;
    this.departmentService = departmentService;
    this.participantService = participantService;
    this.organisationService = organisationService;
  }

  async createUser(data: UserCreateData): Promise<UserView> {
    const {
      name,
      username,
      email,
      phone,
      departmentId,
      organisationId,
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
      const departmentService = this.departmentService.withSession(session);
      const organisationService = this.organisationService.withSession(session);

      await userService.assertNotExistWithEmail(email);
      await userService.assertNotExistWithUsername(username);
      await userService.assertNotExistWithTabelNumber(tabelNumber);

      if (organisationId) {
        await organisationService.assertExist(organisationId, 400);
      }

      if (departmentId) {
        await departmentService.assertExist(departmentId, 400);
      }

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

  async blockUser({ id, type }: { id: string; type: ActionType }) {
    const monitorInitData = await getMonitoringInitData();
    const actionService = new ActionService();
    try {
      if (monitorInitData.session?.user.role !== UserRole.USER_ADMIN) {
        throw new Error('Недостаточно прав для блокировки пользователя');
      }
      await this.userService.assertExist(id);
      const user = await this.userService.getById(id);

      if (!user.ivaProfileId) {
        throw new UserNotRegisteredInIvaError();
      }

      await this.ivaService.blockUser(user.ivaProfileId);
      await this.userService.update(id, { status: UserStatus.BLOCKED });
      actionService.add({
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
        actionService.add({
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
      actionService.add({
        ip: monitorInitData.ip,
        initiator: monitorInitData.initiator,
        type: ActionType.ADMIN_USER_BLOCK,
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
