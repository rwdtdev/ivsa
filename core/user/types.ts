import { RequiredNotNull } from '@/server/types';
import { User, UserRole, UserStatus } from '@prisma/client';
import { SortOrder } from '@/constants/data';

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
  query: {
    statuses?: UserStatus[];
    roles?: UserRole[];
    organisationsIds?: string[];
    departmentsIds?: string[];
  };
}>;

export type UserGetData = Partial<{
  id: string;
  username: string;
  email: string;
}>;
