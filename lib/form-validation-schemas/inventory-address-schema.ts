import * as z from 'zod';

export const InventoryAddressFormSchema = z.object({
  address: z.string()
});

export type InventoryAddressFormData = z.infer<typeof InventoryAddressFormSchema>;
