'use server';

import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { getUserByEmail } from '@/server/services/users';
import {
  ForgotPasswordFormData,
  ForgotPasswordFormSchema
} from '@/lib/form-validation-schemas/forgot-password-schema';
import { JwtSecret } from '@/constants/jwt';

export async function sendNewPassword(data: ForgotPasswordFormData) {
  const result = ForgotPasswordFormSchema.safeParse(data);

  if (!result.success) {
    return { success: false };
  }

  const { email } = result.data;
  const user = await getUserByEmail(email);

  if (!user) {
    return { success: false, error: '' };
  }

  const token = jwt.sign({ username: user.username }, JwtSecret, {
    expiresIn: '15m'
  });

  try {
    const message = {
      from: 'email@example.com',
      to: user.email,
      subject: 'Восстановление пароля',
      text: `Ссылка для восстановления пароля: ${process.env.NEXTAUTH_URL}/forgot-password/${token}`
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

    console.debug(`Sent mail to ${email} and received msgId: ${info.messageId}`);
    return info.messageId;
  } catch (err) {
    throw err;
  }
}
