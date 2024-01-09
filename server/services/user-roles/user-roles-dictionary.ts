import { UserRole } from './UserRole';

// @TODO: User roles dictionary in memory. Create table in Postgre?

export const userRolesDictionary: UserRolesDictionary = [
  {
    name: 'admin',
    description: 'Администратор'
  },
  {
    name: 'user',
    description: 'Пользователь'
  }
];

export type UserRoleObject = { name: UserRole; description: string };
export type UserRolesDictionary = Array<UserRoleObject>;
