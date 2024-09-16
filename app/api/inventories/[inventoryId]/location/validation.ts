import { z } from 'zod';

export const PathParamsSchema = z.object({
  inventoryId: z.string().trim().min(1)
});

export const CreateInventoryLocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  accuracy: z.number(),
  dateTime: z.number(),
  userId: z.string()
});

export type CreateInventoryLocationData = z.infer<typeof CreateInventoryLocationSchema>;
