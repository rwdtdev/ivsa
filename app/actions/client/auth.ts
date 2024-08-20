import {
  LoginFormData,
  LoginFormSchema
} from '@/lib/form-validation-schemas/login-form-schema';
import { signIn } from 'next-auth/react';
import { loginAction } from '../server/users';
import { ActionStatus } from '@prisma/client';

export async function authenticate(
  data: LoginFormData,
  monitoringData: { ip: string }
): Promise<boolean> {
  const result = LoginFormSchema.safeParse(data);

  if (result.success) {
    const { username, password } = result.data;
    const res = await signIn('credentials', {
      username,
      password,
      redirect: false
    });

    if (res?.error) {
      loginAction(monitoringData, ActionStatus.ERROR, 'Неверные логин или пароль');
      return false;
    }
    loginAction({ ...monitoringData, username }, ActionStatus.SUCCESS);
    return true;
  }

  loginAction(
    monitoringData,
    ActionStatus.ERROR,
    'Логин или пароль не соответствуют LoginFormSchema'
  );
  return false;
}
