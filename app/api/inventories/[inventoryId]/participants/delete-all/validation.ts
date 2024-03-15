import { z } from 'zod';

export const PathParamsSchema = z.object({
  inventoryId: z.string().trim().min(1).uuid()
});

export const QueryParamsSchema = z.object({
  eventId: z.string().trim().min(1).cuid()
});
