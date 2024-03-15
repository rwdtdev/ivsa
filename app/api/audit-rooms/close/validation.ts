import { z } from 'zod';

export const CloseAuditRoomBodySchema = z.object({
  eventId: z.string().trim().min(1).cuid(),
  inventoryId: z.string().trim().min(1).uuid()
});

export type CloseAuditRoomData = z.infer<typeof CloseAuditRoomBodySchema>;
