import { z } from 'zod';

export const CloseBriefingRoomBodySchema = z.object({
  eventId: z.string().trim().min(1).uuid()
});

export type CloseBriefingRoomData = z.infer<typeof CloseBriefingRoomBodySchema>;
