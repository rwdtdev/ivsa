import { RequiredNotNull } from '@/server/types';
import { User, UserRole } from '@prisma/client';
import { SortDirection } from 'powerbi-models';

export type ClientUser = Omit<User, 'password'>;

export type UserCreateData = RequiredNotNull<
  Omit<
    User,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'passwordHashes'
    | 'refreshToken'
    | 'lastUpdatePasswordDate'
    | 'organisationId'
    | 'departmentId'
  >
>;

export type UserUpdateData = Partial<
  Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'role' | 'passwordHashes'> & {
    role: UserRole;
    passwordHashes: string[];
  }
>;

export type UsersGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  sortDirection: SortDirection;
}>;

export type UserGetData = Partial<{
  id: string;
  username: string;
  email: string;
}>;
