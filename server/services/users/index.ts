import _ from 'underscore';
import bcrypt from 'bcryptjs';
import prisma from '@/server/services/prisma';
import ApiError from '@/server/utils/error';
import { ClientUser, UserCreateData, UserUpdateData, UsersGetData } from './types';
import { PaginatedResponse } from '@/server/types';
import { filterSearchTerm } from '@/server/utils';
import { generatePasswordAsync } from '@/server/utils/password-generator';
import { PrismaClient, User, UserRole, UserStatus } from '@prisma/client';
import { exclude } from '@/server/utils/exclude';
import { UserView } from '@/types/user';
import { TransactionSession } from '@/types/prisma';
import { SortOrder } from '@/constants/data';
import IvaAPI from '../iva/api';
import { CreateIvaUserError, IvaUserAlreadyExist } from './errors';

const defaultLimit = 100;

type GetUserParams = {
  password: string;
  username: string;
};

const UserNotFoundError = new ApiError('User is not found', 404);

export class UserService {
  private prisma: PrismaClient | TransactionSession;

  constructor(transactionSession?: TransactionSession) {
    this.prisma = transactionSession ?? prisma;
  }

  static withSession(session: TransactionSession) {
    return new this(session);
  }

  assertExist = async (id: string): Promise<void> => {
    const count = await this.prisma.user.count({ where: { id } });

    if (!count || count === 0) {
      throw new ApiError(`User with id (${id}) not found`, 404);
    }
  };

  async getUserById(id: string) {
    const user = await this.prisma.user.findFirst({ where: { id } });

    if (!user) {
      throw new ApiError(`User with id (${id}) not found`, 404);
    }

    return user;
  }

  getUserBy = async (query: Partial<ClientUser>): Promise<ClientUser | null> => {
    const user = await this.prisma.user.findFirst({
      where: query
    });

    if (!user) throw UserNotFoundError;

    return user;
  };

  async getUsers(usersGetData: UsersGetData = {}): Promise<PaginatedResponse<UserView>> {
    const {
      page = 1,
      limit = defaultLimit,
      searchTerm,
      sortDirection = SortOrder.Descending,
      query
    } = usersGetData;

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

  setNewStatus = async (id: string, status: UserStatus) => {
    const user = await this.prisma.user.findFirst({ where: { id } });

    if (!user) {
      throw new ApiError(`User with id (${id}) not found`, 404);
    }

    await this.prisma.user.update({
      where: { id },
      data: { status }
    });
  };
}

export const getUserBy = async ({
  password,
  username
}: GetUserParams): Promise<ClientUser | null> => {
  const user = await prisma.user.findUnique({
    where: {
      password,
      username
    }
  });

  if (!user) throw UserNotFoundError;

  return user;
};

export const getUserByEmail = async (email: string): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) throw UserNotFoundError;

  return user;
};

export const getUserByUsername = async (username: string): Promise<User> => {
  const user = await prisma.user.findFirst({
    where: { username }
  });

  if (!user) throw UserNotFoundError;

  return user;
};

export const getUsers = async (
  usersGetData: UsersGetData = {}
): Promise<PaginatedResponse<UserView>> => {
  const {
    page = 1,
    limit = defaultLimit,
    searchTerm,
    sortDirection = 'desc'
  } = usersGetData;

  const search = filterSearchTerm(searchTerm, 'or');

  const where = {
    where: {
      ...(search && {
        OR: [
          { name: { search } },
          { username: { search } },
          { email: { search } },
          { tabelNumber: { search } }
        ]
      })
    }
  };

  const totalCount = await prisma.user.count({ ...where });

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
};

export const createUser = async (userCreateData: UserCreateData): Promise<ClientUser> => {
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
  } = userCreateData;

  const isExistWithEmail = await prisma.user.findFirst({
    where: { email }
  });

  if (isExistWithEmail) {
    throw new ApiError(`User with email: ${email} already exists.`, 409);
  }

  const isExistWithUserName = await prisma.user.findFirst({
    where: { username }
  });

  if (isExistWithUserName) {
    throw new ApiError(`Username: ${username} is already taken.`, 409);
  }

  if (organisationId) {
    const isExistOrganisation = await prisma.organisation.findFirst({
      where: { id: organisationId }
    });

    if (!isExistOrganisation) {
      throw new ApiError('Wrong organisation id', 409);
    }
  }

  if (departmentId) {
    const isExistDepartment = await prisma.department.findFirst({
      where: { id: departmentId }
    });

    if (!isExistDepartment) {
      throw new ApiError('Wrong department id', 409);
    }
  }

  // const password = await generatePasswordAsync();
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const ivaUser = await IvaAPI.users.create({
    login: username,
    userType: role === UserRole.ADMIN ? UserRole.ADMIN : UserRole.USER,
    securityLevel: 'UNCLASSIFIED',
    name,
    email: { value: email, privacy: 'AUTHORIZED' },
    phone: { value: phone, privacy: 'AUTHORIZED' },
    password,
    isConferenceCreationEnabled: true
  });

  if (!ivaUser) {
    throw new CreateIvaUserError();
  }

  // @TODO: узнать все коды ошибок IVA
  if (ivaUser && !ivaUser.profileId) {
    const res = JSON.parse(ivaUser);
    if (res && res.reason === 'USER_WITH_SUCH_EMAIL_ALREADY_EXISTS') {
      throw new IvaUserAlreadyExist();
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
      ivaProfileId: ivaUser.profileId,
      password: passwordHash,
      passwordHashes: passwordHash
    }
  });

  if (!user) {
    throw new ApiError('User create failed.', 400);
  }

  return user;
};

export const updateUser = async (
  id: string,
  data: UserUpdateData
): Promise<ClientUser> => {
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

  if (!updatedUser) throw new ApiError('Bad request', 400);

  return user;
};

export const deleteUser = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: { id }
  });

  if (!user) {
    throw new ApiError(`User with id (${id}) not found`, 404);
  }

  await prisma.user.delete({ where: { id } });
};

export const excludeFromUser = (user: User) =>
  exclude(user, 'password', 'passwordHashes');
