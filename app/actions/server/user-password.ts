'use server';

import jwt from 'jsonwebtoken';
import {
  ForgotPasswordFormData,
  ForgotPasswordFormSchema
} from '@/lib/form-validation-schemas/forgot-password-schema';
import UserService from '@/server/services/users';
import { JwtSecret } from '@/constants/jwt';
import { transporter } from '@/lib/smtp-transporter';
import { UserStatus } from '@prisma/client';
import { doTransaction } from '@/lib/prisma-transaction';
import { revalidatePath } from 'next/cache';
import { TransactionSession } from '@/types/prisma';

export async function sendRecoveryLinkAction(data: ForgotPasswordFormData) {
  const result = ForgotPasswordFormSchema.safeParse(data);
  const userService = new UserService();

  if (!result.success) return false;

  const { email } = result.data;
  const user = await userService.getBy({ email });

  if (!user) return false;

  const token = jwt.sign({ username: user.username }, JwtSecret, { expiresIn: '15m' });

  return await transporter.sendMail({
    from: process.env.TRANSPORT_FROM,
    to: user.email,
    subject: 'Восстановление пароля',
    text: `Ссылка для восстановления пароля: ${process.env.NEXTAUTH_URL}/forgot-password/${token}`
  });
}

export async function setActiveAndSendRecoveryLinkAction(userId: string, email: string) {
  await doTransaction(async (txSession: TransactionSession) => {
    const userServiceWithSession = UserService.withSession(txSession);

    await userServiceWithSession.assertExist(userId);
    await userServiceWithSession.setNewStatus(userId, UserStatus.ACTIVE);

    const token = jwt.sign({ email, userId }, JwtSecret, { expiresIn: '15m' });

    await transporter.sendMail({
      from: process.env.TRANSPORT_FROM,
      to: email,
      subject: 'Восстановление пароля',
      text: `Ссылка для восстановления пароля: ${process.env.NEXTAUTH_URL}/forgot-password/${token}`
    });
  });

  revalidatePath('/admin/users');
}
