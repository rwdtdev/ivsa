import { z } from 'zod';

export const GetEventPortalLinkPathParamsSchema = z.object({
  eventId: z.string().trim().min(1).cuid()
});
