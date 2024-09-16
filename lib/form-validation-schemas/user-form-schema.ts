import { UserRole, UserStatus } from '@prisma/client';
import * as z from 'zod';

export const UserFormSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'Не может быть пустым' })
    .min(3, { message: 'Не менее 3 символов' }),
  password: z
    .string()
    .min(12, { message: 'Не менее 12 символов' })
    .max(32, { message: 'Не более 32 символов' })
    .optional(),
  name: z
    .string()
    .min(1, { message: 'Не может быть пустым' })
    .min(10, { message: 'Не менее 10 символов' }),
  organisationId: z.string().optional(),
  departmentId: z.string().optional(),
  email: z.string().min(1, { message: 'Не может быть пустым' }).email('Неверный формат'),
  tabelNumber: z.string().length(8, { message: 'Должен содержать 8 символов' }),
  phone: z
    .string()
    .min(1, { message: 'Не может быть пустым' })
    .min(8, { message: 'Не менее 8 символов' }),
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
});

export type UserFormData = z.infer<typeof UserFormSchema>;
