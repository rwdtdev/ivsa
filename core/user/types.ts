import { User, UserRole, UserStatus } from '@prisma/client';
import { SortOrder } from '@/constants/data';

export type UserView = Omit<User, 'password' | 'passwordHashes'>;

export type UserCreateData = Omit<
  User,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'passwordHashes'
  | 'refreshToken'
  | 'ivaProfileId'
  | 'isTemporaryPassword'
  | 'lastUpdatePasswordDate'
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
  filter: {
    statuses?: UserStatus[];
    roles?: UserRole[];
    organisationsIds?: string[];
    departmentsIds?: string[];
  };
}> & {
  sort: {
    by: keyof User;
    direction: SortOrder;
  };
};

export type UserGetData = Partial<{
  id: string;
  username: string;
  email: string;
}>;

export type MonitoringUserData = {
  ip: string | null;
  initiator: string;
  details?: {
    adminUsername?: string;
    error?: string;
    editedUserUsername?: string;
    editedUserName?: string;
  };
};
