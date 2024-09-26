import { z } from 'zod';

export const CloseAuditRoomBodySchema = z.object({
  eventId: z.string().trim().min(1).uuid(),
  inventoryId: z.string().trim().min(1)
});

export type CloseAuditRoomData = z.infer<typeof CloseAuditRoomBodySchema>;
