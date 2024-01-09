import ApiError from '../../utils/error';
import { UserRole } from './UserRole';
import {
  UserRoleObject,
  UserRolesDictionary,
  userRolesDictionary
} from './user-roles-dictionary';

/**
 * Simulation requests to directory of roles.
 * That may be in the some database or storage.
 */

export const getRoles = async (): Promise<UserRolesDictionary> =>
  userRolesDictionary;

export const getRole = async (name: UserRole): Promise<UserRoleObject> => {
  const found = userRolesDictionary.find((role) => role.name === name);

  if (!found) {
    throw new ApiError(`Role with name: ${name} not found`, 404);
  }

  return found;
};
