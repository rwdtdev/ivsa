import * as z from 'zod';

export type SetNewPasswordFormData = z.infer<typeof SetNewPasswordFormSchema>;

export const SetNewPasswordFormSchema = z.object({
  newPassword: z
    .string({ required_error: 'Не может быть пустым' })
    .min(12, {
      message: 'Не менее 12-ти мимволов'
    })
    .max(32, { message: 'Не более 32 символов' })
});
