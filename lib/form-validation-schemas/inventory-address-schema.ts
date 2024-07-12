import * as z from 'zod';

export const InventoryAddressFormSchema = z.object({
  address: z
    .string()
    .min(5, { message: 'Адрес должен содержать более 4-х символов' })
    .max(100, { message: 'Адрес не должен содержать не более 100 символов' })
});

export type InventoryAddressFormData = z.infer<typeof InventoryAddressFormSchema>;
