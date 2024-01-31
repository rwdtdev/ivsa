import { SortOrder } from '@/constants/data';
import { RequiredNotNull } from '@/server/types';
import { User, UserRole } from '@prisma/client';

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
