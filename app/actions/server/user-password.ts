'use server';

import {
  ForgotPasswordFormData,
  ForgotPasswordFormSchema
} from '@/lib/form-validation-schemas/forgot-password-schema';
import { UserService } from '@/core/user/UserService';
import { transporter } from '@/lib/smtp-transporter';
import { ActionStatus, ActionType, UserStatus } from '@prisma/client';
import { doTransaction } from '@/lib/prisma-transaction';
import { TransactionSession } from '@/types/prisma';
import { ActionService } from '@/core/action/ActionService';
import { getUnknownErrorText } from '@/lib/helpers';
import { getMonitoringInitData } from '@/lib/getMonitoringInitData';
import { generatePasswordAsync } from '@/utils/password-generator';
import { revalidatePath } from 'next/cache';

export async function sendRecoveryLinkAction(data: ForgotPasswordFormData) {
  const userService = new UserService();
  const actionService = new ActionService();

  const { ip, initiator } = await getMonitoringInitData();
  const result = ForgotPasswordFormSchema.safeParse(data);

  if (!result.success) {
    actionService.add({
      ip,
      initiator,
      type: ActionType.USER_REQUEST_PASSWORD_RESET,
      status: ActionStatus.ERROR,
      details: {
        error: getUnknownErrorText(result.error)
      }
    });

    return false;
  }

  const temporaryPassword = await generatePasswordAsync();

  return await doTransaction(async (session: TransactionSession) => {
    const userServiceWithSession = userService.withSession(session);

    const { email } = result.data;
    const user = await userService.getBy({ email });

    await userServiceWithSession.update(user.id, {
      password: temporaryPassword,
      isTemporaryPassword: true
    });

    const mailResponse = await transporter.sendMail({
      from: process.env.TRANSPORT_FROM,
      to: email,
      subject: 'Восстановление пароля в системе АС ВИ',
      html: `<p>Временный пароль для входа в систему: <b style="font-size: 12pt;">${temporaryPassword}</b></p>`
    });

    if (mailResponse.messageId) {
      actionService.add({
        ip,
        initiator: user.username,
        type: ActionType.USER_REQUEST_PASSWORD_RESET,
        status: ActionStatus.SUCCESS,
        details: {
          email: user.email,
          name: user.name
        }
      });

      return true;
    } else {
      actionService.add({
        ip,
        initiator: user.username,
        type: ActionType.USER_REQUEST_PASSWORD_RESET,
        status: ActionStatus.ERROR,
        details: {
          name: user.name,
          email: user.email,
          error: `Возникла ошибка при отправке временного пароля на почту пользователя с адресом ${email}`
        }
      });

      return false;
    }
  });
}

export async function resetUserPassword(userId: string, email: string) {
  const userService = new UserService();
  const actionService = new ActionService();
  const temporaryPassword = await generatePasswordAsync();

  return await doTransaction(async (session: TransactionSession) => {
    const userServiceWithSession = userService.withSession(session);

    const { ip, initiator } = await getMonitoringInitData();
    const user = await userService.getById(userId);

    await userServiceWithSession.update(userId, {
      password: temporaryPassword,
      isTemporaryPassword: true,
      status: UserStatus.ACTIVE
    });

    const mailResponse = await transporter.sendMail({
      from: process.env.TRANSPORT_FROM,
      to: email,
      subject: 'Сброс пароля администратором системы АС ВИ',
      html: `
        <div>
          <p>Ваш пароль был сброшен администратором системы АС ВИ.</p>
          <p>Временный пароль для входа в систему: <b style="font-size: 12pt;">${temporaryPassword}</b></p>
        </div>
      `
    });

    revalidatePath('/admin/users');

    if (mailResponse.messageId) {
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

      return true;
    } else {
      actionService.add({
        ip,
        initiator,
        type: ActionType.ADMIN_USER_PASSWORD_RESET,
        status: ActionStatus.ERROR,
        details: {
          username: user.username,
          name: user.name
        }
      });
      return false;
    }
  });
}
