'use server';

import { UserService } from '@/core/user/UserService';
import { revalidatePath } from 'next/cache';

export async function updateUsersExpiresAt(usersIds: string[], userExpiresAt: Date) {
  const userService = new UserService();

  try {
    await userService.updateManyByUsersIds(usersIds, { expiresAt: userExpiresAt });
    revalidatePath('/admin/users');
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
