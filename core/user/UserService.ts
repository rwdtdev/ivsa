import bcrypt from 'bcryptjs';
import moment from 'moment';
import prisma from '@/core/prisma';
import { ClientUser, UserUpdateData, UsersGetData } from './types';
import { PaginatedResponse } from '@/types';
import { PrismaClient, User, UserStatus } from '@prisma/client';
import { exclude } from '@/utils/exclude';
import { UserView } from '@/types/user';
import { TransactionSession } from '@/types/prisma';
import {
  UserNotFoundError,
  UserWithEmailAlreadyExistError,
  UserWithTabelNumberAlreadyExistError,
  UserWithUsernameAlreadyExistError
} from './errors';
import { BadRequestError, NotFoundError } from '@/lib/problem-json';

const defaultLimit = 100;

export class UserService {
  private prisma: PrismaClient | TransactionSession;

  constructor(session?: TransactionSession) {
    this.prisma = session ?? prisma;
  }

  withSession(session: TransactionSession) {
    return new UserService(session);
  }

  async assertExist(id: string): Promise<void> {
    const count = await this.prisma.user.count({ where: { id } });

    if (!count || count === 0) {
      throw new NotFoundError({ detail: `User with id (${id}) not found.` });
    }
  }

  async assertNotExistWithEmail(email: string) {
    const count = await prisma.user.count({ where: { email } });

    if (count || count > 0) {
      throw new UserWithEmailAlreadyExistError({
        detail: `User with email: ${email} already exists.`
      });
    }
  }

  async assertNotExistWithUsername(username: string) {
    const count = await prisma.user.count({ where: { username } });

    if (count || count > 0) {
      throw new UserWithUsernameAlreadyExistError({
        detail: `Username: ${username} is already taken.`
      });
    }
  }

  async assertNotExistWithTabelNumber(tabelNumber: string) {
    const count = await prisma.user.count({ where: { tabelNumber } });

    if (count || count > 0) {
      throw new UserWithTabelNumberAlreadyExistError({
        detail: `Username with tabelNumber: ${tabelNumber} already exist.`
      });
    }
  }

  async getByTabelNumbers(tabelNumbers: string[]) {
    const users = await prisma.user.findMany({
      where: { tabelNumber: { in: tabelNumbers } },
      select: {
        status: true,
        expiresAt: true,
        tabelNumber: true
      }
    });

    return {
      total: users.length,
      items: users
    };
  }

  async getByTabelNumber(tabelNumber: string): Promise<ClientUser | null> {
    const user = await prisma.user.findFirst({ where: { tabelNumber } });

    return user;
  }

  async getById(id: string): Promise<ClientUser> {
    const user = await this.prisma.user.findFirst({ where: { id } });

    if (!user) {
      throw new UserNotFoundError({
        detail: `User with id (${id}) not found.`
      });
    }

    return user;
  }

  async getBy(query: Partial<ClientUser>): Promise<ClientUser> {
    // @ts-expect-error types
    const user = await this.prisma.user.findFirst({ where: query });

    if (!user) throw new UserNotFoundError();

    return user;
  }

  async getAll(
    data: UsersGetData = { sort: { by: 'name', direction: 'asc' } }
  ): Promise<PaginatedResponse<UserView>> {
    const { page = 1, limit = defaultLimit, searchTerm, filter, sort } = data;

    const containsSearchTerm = { contains: searchTerm, mode: 'insensitive' };

    const conditions = [];

    if (filter) {
      if (filter.roles) {
        conditions.push({ role: { in: filter.roles } });
      }
      if (filter.statuses) {
        conditions.push({ status: { in: filter.statuses } });
      }
      if (filter.organisationsIds) {
        conditions.push({ organisationId: { in: filter.organisationsIds } });
      }
      if (filter.departmentsIds) {
        conditions.push({ departmentId: { in: filter.departmentsIds } });
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

    // @ts-expect-error types
    const totalCount = await prisma.user.count({ ...where });

    // @ts-expect-error types
    const users = await prisma.user.findMany({
      ...where,
      include: {
        department: true,
        organisation: true
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sort.by || 'name']: sort?.direction || 'asc' }
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

  // TODO REMOVE AFTER TESTING
  async create(data: any): Promise<ClientUser> {
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(data.password, salt);
      data.password = passwordHash;
      data.passwordHashes = [passwordHash];
      data.lastUpdatePasswordDate = new Date();
    }

    const current = moment();

    data.createdAt = current.toDate();
    data.updatedAt = current.toDate();
    // Make configurable when needed
    if (!data.expiresAt) {
      data.expiresAt = current.add(1, 'year').toDate();
    }

    const newUser = await this.prisma.user.create({ data });

    return newUser;
  }

  async updateManyByUsersIds(usersIds: string[], data: UserUpdateData) {
    await Promise.all(usersIds.map((id) => this.assertExist(id)));

    const updateData: Partial<Omit<User, 'id' | 'createdAt'>> = {
      updatedAt: new Date()
    };

    if (data.status) {
      updateData.status = data.status;
    }

    if (data.expiresAt) {
      updateData.expiresAt = data.expiresAt;
    }

    const updatedUsers = await prisma.user.updateMany({
      where: { id: { in: usersIds } },
      data: updateData
    });

    if (!updatedUsers) throw new BadRequestError();

    return updatedUsers;
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

      const hashes = user.passwordHashes;

      if (hashes.length === 5) {
        hashes.shift();
      }

      hashes.push(passwordHash);
      updateData.passwordHashes = hashes;

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
    if (data.ASOZSystemRequestNumber) {
      updateData.ASOZSystemRequestNumber = data.ASOZSystemRequestNumber;
    }
    if (data.expiresAt) {
      updateData.expiresAt = data.expiresAt;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData
    });

    if (!updatedUser) throw new BadRequestError();

    return user;
  }

  async remove(id: string) {
    const user = await prisma.user.findFirst({ where: { id } });

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
