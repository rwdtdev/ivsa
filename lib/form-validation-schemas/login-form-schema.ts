import * as z from 'zod';

export const LoginFormSchema = z.object({
  username: z.string().trim().toLowerCase().min(2, {
    message: 'Имя пользователя должно содержать не менее 2-ух символов.'
  }),
  password: z.string().min(3, {
    message: 'Пароль должен содержать не менее 3-ех символов.'
  })
});

export type LoginFormData = z.infer<typeof LoginFormSchema>;
