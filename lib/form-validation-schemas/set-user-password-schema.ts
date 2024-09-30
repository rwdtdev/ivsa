import * as z from 'zod';

const isHaveUppercase = (value: string) => /[A-Z]/.test(value);
const isHaveLowercase = (value: string) => /[a-z]/.test(value);
const isHaveNumber = (value: string) => /[0-9]/.test(value);
const isHaveSpecial = (value: string) => /[!@#$%^&*()_+=[\]{};':"\\|,.<>/?]/.test(value);

export const SetUserPasswordFormSchema = z
  .object({
    password: z
      .string({ required_error: 'Не может быть пустым' })
      .min(12, {
        message: 'Не менее 12-ти символов'
      })
      .max(32, { message: 'Не более 32 символов' })
      .refine(isHaveUppercase, 'Должен содержать заглавный символ')
      .refine(isHaveLowercase, 'Должен содержать строчный символ')
      .refine(isHaveNumber, 'Должен содержать цифру')
      .refine(isHaveSpecial, 'Должен содержать специальный символ'),
    confirm: z.string({ required_error: 'Введите пароль повторно' })
  })
  .refine(({ password, confirm }) => password === confirm, {
    message: 'Пароли не совпадают',
    path: ['confirm']
  });

export type SetUserPasswordFormData = z.infer<typeof SetUserPasswordFormSchema>;
