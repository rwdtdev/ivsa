import { User } from '@prisma/client';

export type UserView = Omit<User, 'password' | 'passwordHashes' | 'refreshToken'>;

export type UserSession = Omit<
  User,
  | 'password'
  | 'passwordHashes'
  | 'createdAt'
  | 'updatedAt'
  | 'lastUpdatePasswordDate'
  | 'refreshToken'
>;
