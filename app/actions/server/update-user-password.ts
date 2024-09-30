'use server';

import {
  ResetPasswordFormData,
  ResetPasswordFormSchema
} from '@/lib/form-validation-schemas/reset-password-schema';
import { UserService } from '@/core/user/UserService';
import bcrypt from 'bcryptjs';

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

export async function setPermanentUserPassword(
  data: ResetPasswordFormData,
  userId: string
): Promise<{ success: boolean; error: string | null }> {
  const { password } = data;
  const userService = new UserService();

  try {
    const { passwordHashes } = await userService.getPasswordHashesById(userId);

    const isPasswordMatch = passwordHashes.some((hash) =>
      bcrypt.compareSync(password, hash)
    );

    if (isPasswordMatch) {
      return {
        success: false,
        error: 'Пароль совпадает с одним из предыдущих'
      };
    }

    await userService.update(userId, {
      password,
      isTemporaryPassword: false
    });

    return { success: true, error: null };
  } catch (err: Error | any) {
    console.log(err);
    return {
      success: false,
      error: err.message
    };
  }
}
