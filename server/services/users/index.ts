import bcrypt from 'bcrypt';
import prisma from '@/server/services/prisma';
import {
  ClientUser,
  UserCreateData,
  UserUpdateData,
  UsersGetData
} from './types';
import { PaginatedResponse, SortDirection } from '@/server/types';
import { filterSearchTerm } from '@/server/utils';
import ApiError from '@/server/utils/error';
import { generatePasswordAsync } from '@/server/utils/password-generator';
import { UserCredentials } from '@/app/types';
import { User } from '@prisma/client';

const defaultLimit = 100;

type GetUserParams = {
  password: string;
  username: string;
};

const WrongCredentialsError = new ApiError('Wrong credentials!', 401);
const FailedLoginError = new ApiError('Failed to login', 500);
const UserNotFoundError = new ApiError('User is not found', 404);

export const login = async (
  credentials: UserCredentials
): Promise<ClientUser> => {
  if (!credentials) throw WrongCredentialsError;

  try {
    const user = await prisma.user.findFirst({
      where: {
        username: credentials.username
      }
    });

    if (!user) throw WrongCredentialsError;

    const isPasswordCorrect = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (!isPasswordCorrect) throw WrongCredentialsError;

    user.password = '';
    return user;
  } catch (err) {
    console.debug(err);
    throw FailedLoginError;
  }
};

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
): Promise<PaginatedResponse<ClientUser>> => {
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
          { email: { search } }
        ]
      })
    }
  };

  const totalCount = await prisma.user.count({ ...where });

  const users = await prisma.user.findMany({
    ...where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      createdAt: sortDirection as SortDirection
    }
  });

  return {
    items: users,
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

export const createUser = async (
  userCreateData: UserCreateData
): Promise<ClientUser> => {
  const {
    name,
    username,
    email,
    phone,
    departmentId,
    organisationId,
    roles,
    status
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

  const isExistOrganisation = await prisma.organisation.findFirst({
    where: { id: organisationId }
  });

  if (!isExistOrganisation) {
    throw new ApiError('Wrong organisation id', 409);
  }

  const isExistDepartment = await prisma.department.findFirst({
    where: { id: departmentId }
  });

  if (!isExistDepartment) {
    throw new ApiError('Wrong department id', 409);
  }

  const password = await generatePasswordAsync();
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      name,
      username,
      email,
      phone,
      status,
      departmentId,
      organisationId,
      roles: roles.join(','),
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
  }
  if (data.passwordHashes) {
  }
  if (data.phone) {
    updateData.phone = data.phone;
  }
  if (data.roles) {
    updateData.roles = data.roles.join(',');
  }
  if (data.status) {
    updateData.status = data.status;
  }
  if (data.username) {
    updateData.username = data.username;
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
