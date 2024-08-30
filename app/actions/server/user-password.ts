'use server';
import jwt from 'jsonwebtoken';
import {
  ForgotPasswordFormData,
  ForgotPasswordFormSchema
} from '@/lib/form-validation-schemas/forgot-password-schema';
import { UserService } from '@/core/user/UserService';
import { JwtSecret } from '@/constants/jwt';
import { transporter } from '@/lib/smtp-transporter';
import { ActionStatus, ActionType, UserStatus } from '@prisma/client';
import { doTransaction } from '@/lib/prisma-transaction';
import { revalidatePath } from 'next/cache';
import { TransactionSession } from '@/types/prisma';
import { ActionService } from '@/core/action/ActionService';
import { getUnknownErrorText } from '@/lib/helpers';
import { getMonitoringInitData } from '@/lib/getMonitoringInitData';

export async function sendRecoveryLinkAction(data: ForgotPasswordFormData) {
  const result = ForgotPasswordFormSchema.safeParse(data);
  const userService = new UserService();
  const actionService = new ActionService();
  const { ip, initiator } = await getMonitoringInitData();

  if (!result.success) {
    await actionService.add({
      ip,
      initiator: initiator,
      type: ActionType.USER_REQUEST_PASSWORD_RESET,
      status: ActionStatus.ERROR,
      details: {
        error: getUnknownErrorText(result.error)
      }
    });

    return false;
  }

  try {
    const { email } = result.data;
    const user = await userService.getBy({ email });
    const token = jwt.sign({ username: user.username }, JwtSecret, { expiresIn: '15m' });

    await transporter.sendMail({
      from: process.env.TRANSPORT_FROM,
      to: user.email,
      subject: 'Восстановление пароля',
      text: `Ссылка для восстановления пароля: ${process.env.NEXTAUTH_URL}/forgot-password/${token}`
    });

    await actionService.add({
      ip,
      initiator,
      type: ActionType.USER_REQUEST_PASSWORD_RESET,
      status: ActionStatus.SUCCESS,
      details: {
        emailInput: user.email,
        username: user.username,
        name: user.name
      }
    });

    return true;
  } catch (err) {
    await actionService.add({
      ip,
      initiator,
      type: ActionType.USER_REQUEST_PASSWORD_RESET,
      status: ActionStatus.ERROR,
      details: {
        emailInput: data.email,
        error: getUnknownErrorText(err)
      }
    });

    return false;
  }
}

export async function setActiveAndSendRecoveryLinkAction(userId: string, email: string) {
  const userService = new UserService();

  await doTransaction(async (session: TransactionSession) => {
    const userServiceWithSession = userService.withSession(session);

    await userServiceWithSession.assertExist(userId);
    await userServiceWithSession.setNewStatus(userId, UserStatus.ACTIVE);

    const token = jwt.sign({ email, userId }, JwtSecret, { expiresIn: '15m' });

    await transporter.sendMail({
      from: process.env.TRANSPORT_FROM,
      to: email,
      subject: 'Восстановление пароля',
      text: `Ссылка для восстановления пароля: ${process.env.NEXTAUTH_URL}/forgot-password/${token}`
    });

    const { ip, initiator } = await getMonitoringInitData();
    const user = await userService.getById(userId);
    const actionService = new ActionService();
    actionService.add({
      ip,
      initiator,
      type: ActionType.ADMIN_USER_PASSWORD_RESET,
      status: ActionStatus.SUCCESS,
      details: {
        username: user.username,
        name: user.name
      }
    });
  });

  revalidatePath('/admin/users');
}
