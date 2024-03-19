import { z } from 'zod';

export const PathParamsSchema = z.object({
  inventoryId: z.string().trim().min(1)
});

export const QueryParamsSchema = z.string().trim().min(1).cuid();
