'use server';

import {
  ResetPasswordFormData,
  ResetPasswordFormSchema
} from '@/lib/form-validation-schemas/reset-password-schema';
import UserService from '@/server/services/users';

export async function updateUserPassword(data: ResetPasswordFormData, username: string) {
  const result = ResetPasswordFormSchema.safeParse(data);
  const userService = new UserService();

  if (!result.success) {
    return false;
  }

  const { password } = result.data;

  try {
    const user = await userService.getBy({ username });

    await userService.update(user.id, { password });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
