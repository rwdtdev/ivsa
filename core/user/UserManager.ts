import bcrypt from 'bcryptjs';

import { ClientUser, UserCreateData } from './types';
import { DepartmentService } from '../department/DepartmentService';
import { IvaService } from '../iva/IvaService';
import { OrganisationService } from '../organisation/OrganisationService';
import { ParticipantService } from '../participant/ParticipantService';
import { UserService } from './UserService';
import { doTransaction } from '@/lib/prisma-transaction';
import { TransactionSession } from '@/types/prisma';
import { UserRole } from '@prisma/client';
import { CreateIvaUserError } from './errors';

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

  async createUser(data: UserCreateData): Promise<ClientUser> {
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
      password
    } = data;

    return await doTransaction(async (session: TransactionSession) => {
      const userService = this.userService.withSession(session);
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

      const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt(10));

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

      if (!ivaResponse) {
        throw new CreateIvaUserError();
      }

      // TODO Has a long list of error causes, can be categorized for improve in user expirience (for toast userMessage errors).
      if (ivaResponse && !ivaResponse.profileId) {
        try {
          const error = JSON.parse(ivaResponse);
          throw new CreateIvaUserError({ detail: error.reason, info: error });
        } catch {
          throw new CreateIvaUserError();
        }
      }

      const user = await userService.create({
        name,
        username,
        email,
        phone,
        status,
        departmentId,
        organisationId,
        role,
        tabelNumber,
        ivaProfileId: ivaResponse.profileId,
        password: passwordHash,
        passwordHashes: [passwordHash]
      });

      if (!user) {
        await this.ivaService.removeUser(ivaResponse.profileId);

        throw new CreateIvaUserError({
          detail: `Problems occurred during the user (${username}:${tabelNumber}) save process in ASVI.`
        });
      }

      await this.updateParticipantsUser(user);

      return user;
    });
  }

  async updateParticipantsUser({ id, tabelNumber }: ClientUser) {
    const isHaveNotRegistered =
      await this.participantService.isHaveNotRegistered(tabelNumber);

    if (isHaveNotRegistered) {
      await this.participantService.linkParticipantsWithUser(id, tabelNumber);
    }
  }

  async getAll() {
    return this.userService.getAll();
  }
}
