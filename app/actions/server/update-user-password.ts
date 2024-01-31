'use server';

import {
  ResetPasswordFormData,
  ResetPasswordFormSchema
} from '@/lib/form-validation-schemas/reset-password-schema';
import { getUserByUsername, updateUser } from '@/server/services/users';

export async function updateUserPassword(data: ResetPasswordFormData, username: string) {
  const result = ResetPasswordFormSchema.safeParse(data);

  if (!result.success) {
    return false;
  }

  const { password } = result.data;

  try {
    const user = await getUserByUsername(username);

    await updateUser(user.id, { password });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
