import * as z from 'zod';

export const ForgotPasswordFormSchema = z.object({
  email: z
    .string({ required_error: 'Не может быть пустым' })
    .min(1, {
      message: 'Не может быть пустым'
    })
    .email({ message: 'Неверный формат' })
});

export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordFormSchema>;
