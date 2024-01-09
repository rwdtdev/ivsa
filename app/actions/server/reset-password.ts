'use server';

import jwt from 'jsonwebtoken';
import {
  ForgotPasswordFormData,
  ForgotPasswordFormSchema
} from '@/components/ForgotPasswordForm/schema';
import { getUserByEmail, updateUser } from '@/server/services/users';
import { generatePasswordAsync } from '@/server/utils/password-generator';
import nodemailer from 'nodemailer';

export async function resetPassword(data: ForgotPasswordFormData) {
  const result = ForgotPasswordFormSchema.safeParse(data);

  if (!result.success) {
    return { success: false };
  }

  const { email } = result.data;

  const user = await getUserByEmail(email);

  if (!user) {
    return { success: false, error: '' };
  }

  const passwordWithoutSlashes = user.password.replace(/\//g, '');

  const token = jwt.sign({ username: user.username }, 'secret', {
    expiresIn: '1h'
  });

  try {
    const message = {
      from: 'email@example.com',
      to: email,
      subject: 'Восстановление пароля',
      text: `Ссылка для восстановления пароля: http://127.0.0.1:3000/forgot-password/${token}/`
    };

    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        // Test user on brevo
        user: 'farevuar@gmail.com',
        pass: '6jM4k9YvTyQ5UH8a'
      }
    });

    const info = await transporter.sendMail(message);

    console.debug(
      `Sent mail to ${email} and received msgId: ${info.messageId}`
    );
    return info.messageId;
  } catch (err) {
    throw err;
  }
}
