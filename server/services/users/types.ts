import { RequiredNotNull } from '@/server/types';
import { User } from '@prisma/client';
import { UserRole } from '../user-roles/UserRole';
import { SortOrder } from '@/constants/data';

export enum UserStatus {
  Active = 'active',
  Blocked = 'blocked'
}

export type ClientUser = Omit<User, 'password'>;

export type UserCreateData = RequiredNotNull<
  Omit<
    User,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'password'
    | 'passwordHashes'
    | 'refreshToken'
    | 'lastUpdatePasswordDate'
    | 'organisationId'
    | 'departmentId'
  >
> & {
  departmentId?: string;
  organisationId?: string;
};

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
  sortDirection: SortOrder;
}>;

export type UserGetData = Partial<{
  id: string;
  username: string;
  email: string;
}>;
