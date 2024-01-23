import { UserRole } from '@/server/services/user-roles/UserRole';
import { UserStatus } from '@prisma/client';
import * as z from 'zod';

export const UserFormSchema = z.object({
  username: z.string().min(3, { message: 'Не менее 3 символов' }),
  password: z
    .string()
    .min(12, { message: 'Не менее 12 символов' })
    .max(32, { message: 'Не более 32 символов' }),
  name: z.string().min(10, { message: 'Не менее 10 символов' }),
  organisationId: z.string().optional(),
  departmentId: z.string().optional(),
  email: z.string().email('Неверный формат'),
  tabelNumber: z.string().min(1, { message: 'Не менее 1 символа' }), //@TODO сколько?
  phone: z.string().min(10, { message: 'Не менее 10 символов' }),
  status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.RECUSED]),
  roles: z.enum([UserRole.Admin, UserRole.User])
});

export type UserFormData = z.infer<typeof UserFormSchema>;
