import {
  LoginFormData,
  LoginFormSchema
} from '@/lib/form-validation-schemas/login-form-schema';
import { signIn } from 'next-auth/react';

export async function authenticate(data: LoginFormData): Promise<boolean> {
  const result = LoginFormSchema.safeParse(data);

  if (result.success) {
    const { username, password } = result.data;
    const res = await signIn('credentials', {
      username,
      password,
      redirect: false
    });

    if (res?.error) return false;

    return true;
  }

  return false;
}
