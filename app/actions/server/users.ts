'use server';

import { createUser, deleteUser } from '@/server/services/users';
import { validate } from '@/server/utils/validate';
import { CreateUserSchema } from '@/server/validations/users';
import { revalidatePath } from 'next/cache';

export async function createUserAction(formData: FormData) {
  const name = formData.get('name');
  const username = formData.get('username');
  const phone = formData.get('phone');
  const email = formData.get('email');
  const status = formData.get('status');

  /**
   * @TODO
   *    It will be a name of department or id?
   *    Need check for existing department in organisation
   */
  const departmentId = formData.get('department');

  /**
   * @TODO
   *    It will be a name of orgasniation or id?
   *    Need check for existing organisation
   */
  const organisationId = formData.get('orgasniastion');

  /**
   * @TODO
   *    It will be a string or array of string?
   *    If primitive string need split by "," character.
   */
  const roles = formData.get('roles');

  const userCreateData = validate(CreateUserSchema, {
    name,
    username,
    phone,
    email,
    status,
    departmentId,
    organisationId,
    roles
  });

  await createUser(userCreateData);
}

export async function updateUser(formData: FormData) {}

export async function getUserById(id: string) {
  return getUserById(id);
}

export async function deleteUserAction(id: string) {
  try {
    await deleteUser(id);
  } catch (err) {
    throw err;
  }

  revalidatePath('/admin/users');
}

export async function resetPasswordAction(userId: string) {
  try {
  } catch (err) {
    throw err;
  }
}
