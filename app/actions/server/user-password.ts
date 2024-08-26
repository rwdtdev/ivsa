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
import { unknownUser } from '@/constants/actions';
import { MonitoringUserData } from '@/core/user/types';

export async function sendRecoveryLinkAction(
  data: ForgotPasswordFormData,
  monitoringData: MonitoringUserData
) {
  const result = ForgotPasswordFormSchema.safeParse(data);
  const userService = new UserService();
  const actionService = new ActionService();

  if (!result.success) {
    await actionService.add({
      ...monitoringData,
      type: ActionType.USER_REQUEST_PASSWORD_RESET,
      status: ActionStatus.ERROR,
      initiator: unknownUser,
      details: {
        ...monitoringData.details,
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
      ...monitoringData,
      type: ActionType.USER_REQUEST_PASSWORD_RESET,
      status: ActionStatus.SUCCESS,
      initiator: user.name || unknownUser,
      details: {
        ...monitoringData.details,
        emailInput: user.email,
        username: user.username,
        name: user.name
      }
    });

    return true;
  } catch (err) {
    await actionService.add({
      ...monitoringData,
      type: ActionType.USER_REQUEST_PASSWORD_RESET,
      status: ActionStatus.ERROR,
      initiator: unknownUser,
      details: {
        ...monitoringData.details,
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
  });

  revalidatePath('/admin/users');
}
