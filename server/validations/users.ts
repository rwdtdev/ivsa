import { z } from 'zod';
import { UserRole, UserStatus } from '@prisma/client';

export const CreateUserSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().min(1).email(),
  status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.RECUSED]),
  departmentId: z.string().min(1),
  role: z.enum([UserRole.ADMIN, UserRole.USER])
});
