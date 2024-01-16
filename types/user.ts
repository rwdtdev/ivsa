import { User } from '@prisma/client';

export type UserView = Omit<User, 'password' | 'passwordHashes'>;
