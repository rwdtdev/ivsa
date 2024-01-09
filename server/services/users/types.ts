import { RequiredNotNull } from '@/server/types';
import { User } from '@prisma/client';
import { SortDirection } from 'powerbi-models';
import { UserRole } from '../user-roles/UserRole';

export enum UserStatus {
  Active = 'active',
  Blocked = 'blocked'
}

export type ClientUser = Omit<User, 'password'>;

export type UserCreateData = RequiredNotNull<
  Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'roles' | 'passwordHashes'> & {
    roles: UserRole[];
  }
> &
  Pick<User, 'departmentId'>;

export type UserUpdateData = Partial<
  Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'roles' | 'passwordHashes'> & {
    roles: UserRole[];
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
