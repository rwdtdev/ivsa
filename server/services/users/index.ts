import _ from 'underscore';
import bcrypt from 'bcryptjs';
import prisma from '@/server/services/prisma';
import { ClientUser, UserCreateData, UserUpdateData, UsersGetData } from './types';
import { PaginatedResponse } from '@/server/types';
import { PrismaClient, User, UserRole, UserStatus } from '@prisma/client';
import { exclude } from '@/server/utils/exclude';
import { UserView } from '@/types/user';
import { TransactionSession } from '@/types/prisma';
import { SortOrder } from '@/constants/data';
import IvaAPI from '../iva/api';
import {
  CreateIvaUserError,
  UserWithEmailAlreadyExistError,
  UserWithTabelNumberAlreadyExistError,
  UserWithUsernameAlreadyExistError
} from './errors';
import { BadRequestError, NotFoundError } from '@/lib/problem-json';
import OrganisationService from '../organisations';
import DepartmentService from '../departments';

const defaultLimit = 100;

export default class UserService {
  private prisma: PrismaClient | TransactionSession;

  constructor(transactionSession?: TransactionSession) {
    this.prisma = transactionSession ?? prisma;
  }

  static withSession(session: TransactionSession) {
    return new this(session);
  }

  async assertExist(id: string): Promise<void> {
    const count = await this.prisma.user.count({ where: { id } });

    if (!count || count === 0) {
      throw new NotFoundError({ detail: `User with id (${id}) not found.` });
    }
  }

  async assertNotExistWithEmail(email: string) {
    const count = await prisma.user.count({
      where: { email }
    });

    if (count || count > 0) {
      throw new UserWithEmailAlreadyExistError({
        detail: `User with email: ${email} already exists.`
      });
    }
  }

  async assertNotExistWithUsername(username: string) {
    const count = await prisma.user.count({
      where: { username }
    });

    if (count || count > 0) {
      throw new UserWithUsernameAlreadyExistError({
        detail: `Username: ${username} is already taken.`
      });
    }
  }

  async assertNotExistWithTabelNumber(tabelNumber: string) {
    const count = await prisma.user.count({
      where: { tabelNumber }
    });

    if (count || count > 0) {
      throw new UserWithTabelNumberAlreadyExistError({
        detail: `Username with tabelNumber: ${tabelNumber} already exist.`
      });
    }
  }

  async getById(id: string) {
    await this.assertExist(id);

    const user = await this.prisma.user.findFirst({ where: { id } });

    return user;
  }

  async getBy(query: Partial<ClientUser>): Promise<ClientUser> {
    const user = await this.prisma.user.findFirst({
      where: query
    });

    if (!user) throw new NotFoundError();

    return user;
  }

  async getAll(data: UsersGetData = {}): Promise<PaginatedResponse<UserView>> {
    const {
      page = 1,
      limit = defaultLimit,
      searchTerm,
      sortDirection = SortOrder.Descending,
      query
    } = data;

    const containsSearchTerm = { contains: searchTerm, mode: 'insensitive' };

    const conditions = [];

    if (query) {
      if (query.roles) {
        conditions.push({ role: { in: query.roles } });
      }
      if (query.statuses) {
        conditions.push({ status: { in: query.statuses } });
      }
      if (query.organisationsIds) {
        conditions.push({ organisationId: { in: query.organisationsIds } });
      }
      if (query.departmentsIds) {
        conditions.push({ departmentId: { in: query.departmentsIds } });
      }
    }

    const where = {
      where: {
        ...(searchTerm && {
          OR: [
            { name: containsSearchTerm },
            { username: containsSearchTerm },
            { email: containsSearchTerm },
            { tabelNumber: containsSearchTerm },
            { phone: containsSearchTerm }
          ]
        }),
        ...(conditions.length > 0 && { AND: conditions })
      }
    };

    // @ts-ignore
    const totalCount = await prisma.user.count({ ...where });

    // @ts-ignore
    const users = await prisma.user.findMany({
      ...where,
      include: {
        department: true,
        organisation: true
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: sortDirection
      }
    });

    return {
      items: users.map(excludeFromUser),
      pagination: {
        total: totalCount,
        pagesCount: Math.ceil(totalCount / limit),
        currentPage: page,
        perPage: limit,
        from: (page - 1) * limit + 1,
        to: (page - 1) * limit + users.length,
        hasMore: page < Math.ceil(totalCount / limit)
      }
    };
  }

  async create(data: UserCreateData): Promise<ClientUser> {
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

    await this.assertNotExistWithEmail(email);
    await this.assertNotExistWithUsername(username);
    await this.assertNotExistWithTabelNumber(tabelNumber);

    if (organisationId) {
      const organisationService = new OrganisationService();
      await organisationService.assertExist(organisationId, 400);
    }

    if (departmentId) {
      const departmentService = new DepartmentService();
      await departmentService.assertExist(departmentId, 400);
    }

    const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt(10));

    const ivaResponse = await IvaAPI.users.create({
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
      } finally {
        throw new CreateIvaUserError();
      }
    }

    const user = await prisma.user.create({
      data: {
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
        passwordHashes: passwordHash
      }
    });

    if (!user) {
      await IvaAPI.users.remove(ivaResponse.profileId);

      throw new CreateIvaUserError({
        detail: `Problems occurred during the user (${username}:${tabelNumber}) save process in ASVI.`
      });
    }

    return user;
  }

  async update(id: string, data: UserUpdateData): Promise<ClientUser> {
    await this.assertExist(id);

    const updateData: Partial<Omit<User, 'id' | 'createdAt'>> = {
      updatedAt: new Date()
    };

    const user = await prisma.user.findFirstOrThrow({
      where: { id }
    });

    if (data.email) {
      updateData.email = data.email;
    }
    if (data.name) {
      updateData.name = data.name;
    }
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(data.password, salt);
      updateData.password = passwordHash;

      const hashes = user.passwordHashes.split(',');

      if (hashes.length === 5) {
        hashes.shift();
      }
      hashes.push(passwordHash);
      updateData.passwordHashes = hashes.join(',');

      updateData.lastUpdatePasswordDate = new Date();
    }
    if (data.phone) {
      updateData.phone = data.phone;
    }
    if (data.role) {
      updateData.role = data.role;
    }
    if (data.status) {
      updateData.status = data.status;
    }
    if (data.username) {
      updateData.username = data.username;
    }
    if (data.tabelNumber) {
      updateData.tabelNumber = data.tabelNumber;
    }
    if (data.name) {
      updateData.name = data.name;
    }
    if (data.organisationId) {
      updateData.organisationId = data.organisationId;
    }
    if (data.departmentId) {
      updateData.departmentId = data.departmentId;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData
    });

    if (!updatedUser) throw new BadRequestError();

    return user;
  }

  async remove(id: string) {
    const user = await prisma.user.findFirst({
      where: { id }
    });

    if (!user) {
      throw new NotFoundError({ detail: `User with id (${id}) not found` });
    }

    await prisma.user.delete({ where: { id } });
  }

  async setNewStatus(id: string, status: UserStatus) {
    const user = await this.prisma.user.findFirst({ where: { id } });

    if (!user) {
      throw new NotFoundError({ detail: `User with id (${id}) not found` });
    }

    await this.prisma.user.update({
      where: { id },
      data: { status }
    });
  }
}

export const excludeFromUser = (user: User) =>
  exclude(user, 'password', 'passwordHashes');
