import { z } from 'zod';

export const GetInventoryPortalLinkPathParamsSchema = z.object({
  eventId: z.string().trim().min(1).uuid(),
  inventoryId: z.string().trim().min(1)
});
