import { z } from 'zod';

export const PathParamsSchema = z.object({
  inventoryId: z.string().trim().min(1)
});

export const CreateInventoryLocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  accuracy: z.number(),
  address: z.string().trim().min(1),
  dateTime: z.string().trim().datetime()
});

export type CreateInventoryLocationData = z.infer<typeof CreateInventoryLocationSchema>;
