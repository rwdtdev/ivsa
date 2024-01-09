'use server';

import bcrypt from 'bcrypt';
import {
  SetNewPasswordFormData,
  SetNewPasswordFormSchema
} from '@/components/ResetPasswordForm/schema';
import { getUserByUsername, updateUser } from '@/server/services/users';

export async function setNewPassword(
  data: SetNewPasswordFormData,
  username: string
) {
  const result = SetNewPasswordFormSchema.safeParse(data);

  if (!result.success) {
    return false;
  }

  const { newPassword } = result.data;

  try {
    const user = await getUserByUsername(username);

    await updateUser(user.id, { password: newPassword });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
