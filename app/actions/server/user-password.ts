'use server';

import jwt from 'jsonwebtoken';
import {
  ForgotPasswordFormData,
  ForgotPasswordFormSchema
} from '@/lib/form-validation-schemas/forgot-password-schema';
import { UserService, getUserByEmail } from '@/server/services/users';
import { JwtSecret } from '@/constants/jwt';
import { transporter } from '@/lib/smtp-transporter';
import { UserStatus } from '@prisma/client';
import { doTransaction } from '@/lib/prisma-transaction';
import { revalidatePath } from 'next/cache';
import { TransactionSession } from '@/types/prisma';

export async function sendRecoveryLinkAction(data: ForgotPasswordFormData) {
  try {
    const result = ForgotPasswordFormSchema.safeParse(data);

    if (!result.success) return false;

    const { email } = result.data;
    const user = await getUserByEmail(email);

    if (!user) return false;

    const token = jwt.sign({ username: user.username }, JwtSecret, { expiresIn: '15m' });

    return await transporter.sendMail({
      from: process.env.TRANSPORT_FROM,
      to: user.email,
      subject: 'Восстановление пароля',
      text: `Ссылка для восстановления пароля: ${process.env.NEXTAUTH_URL}/forgot-password/${token}`
    });
  } catch (err) {
    throw err;
  }
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
