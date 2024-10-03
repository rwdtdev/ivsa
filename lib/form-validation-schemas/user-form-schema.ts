import { UserRole, UserStatus } from '@prisma/client';
import * as z from 'zod';

export const UserFormSchema = z.object({
  username: z
    .string()
    .min(8, { message: 'Не менее 8 символов' })
    .max(15, { message: 'Не более 50 символов' })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(12, { message: 'Не менее 12 символов' })
    .max(32, { message: 'Не более 32 символов' })
    .optional(),
  name: z
    .string()
    .min(1, { message: 'Не может быть пустым' })
    .min(10, { message: 'Не менее 10 символов' })
    .trim(),
  divisionId: z.string().optional(),
  email: z
    .string()
    .min(1, { message: 'Не может быть пустым' })
    .email('Неверный формат')
    .trim()
    .toLowerCase(),
  tabelNumber: z
    .string()
    .min(8, { message: 'Не менее 8 символов' })
    .max(50, { message: 'Не более 50 символов' })
    .trim(),
  phone: z
    .string()
    .min(1, { message: 'Не может быть пустым' })
    .min(8, { message: 'Не менее 8 символов' })
    .trim(),
  status: z.nativeEnum(UserStatus, {
    errorMap: () => {
      return { message: 'Выберите статус пользователя' };
    }
  }),
  role: z.nativeEnum(UserRole, {
    errorMap: () => {
      return { message: 'Выберите роль' };
    }
  }),
  expiresAt: z.date(),
  ASOZSystemRequestNumber: z
    .string()
    .min(1, { message: 'Не может быть пустым' })
    .max(200, { message: 'Не более 200 символов' })
    .trim()
});

export type UserFormData = z.infer<typeof UserFormSchema>;
