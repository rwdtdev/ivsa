import { z } from 'zod';

export const GetInventoryPortalLinkPathParamsSchema = z.object({
  eventId: z.string().trim().min(1).cuid(),
  inventoryId: z.string().trim().min(1)
});
