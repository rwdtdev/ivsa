import * as z from 'zod';

export const ResetPasswordFormSchema = z
  .object({
    password: z
      .string({ required_error: 'Не может быть пустым' })
      .min(12, {
        message: 'Не менее 12-ти мимволов'
      })
      .max(32, { message: 'Не более 32 символов' }),
    confirm: z.string({ required_error: 'Введите пароль повторно' })
  })
  .refine(({ password, confirm }) => password === confirm, {
    message: 'Пароль не совпадают',
    path: ['confirm']
  });

export type ResetPasswordFormData = z.infer<typeof ResetPasswordFormSchema>;
