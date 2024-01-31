import { Department, Organisation, User } from '@prisma/client';

export type UserView = Omit<User, 'password' | 'passwordHashes' | 'refreshToken'> & {
  organisation?: Organisation;
  department?: Department;
};

export type UserSession = Omit<
  User,
  | 'password'
  | 'passwordHashes'
  | 'createdAt'
  | 'updatedAt'
  | 'lastUpdatePasswordDate'
  | 'refreshToken'
>;
