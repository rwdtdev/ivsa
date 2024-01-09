import { z } from 'zod';
import { UserRole } from '@/server/services/user-roles/UserRole';
import { UserStatus } from '@/server/services/users/types';

export const CreateUserSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().min(1).email(),
  status: z.enum([UserStatus.Active, UserStatus.Blocked]),
  departmentId: z.string().min(1),
  roles: z.enum([UserRole.Admin, UserRole.User]).array()
});
