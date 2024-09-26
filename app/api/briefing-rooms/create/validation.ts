import { z } from 'zod';

export const CreateBriefingRoomBodySchema = z.object({
  eventId: z.string().trim().min(1).uuid()
});

export type CreateBriefingRoomData = z.infer<typeof CreateBriefingRoomBodySchema>;
