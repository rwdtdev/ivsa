'use server';

import { UserService } from '@/core/user/UserService';
import { UserStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function updateUsersStatus(usersIds: string[], userStatus: UserStatus) {
  const userService = new UserService();

  try {
    await userService.updateManyByUsersIds(usersIds, { status: userStatus });
    revalidatePath('/admin/users');
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
