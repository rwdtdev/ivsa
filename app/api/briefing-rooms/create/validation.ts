import { z } from 'zod';

export const CreateBriefingRoomBodySchema = z.object({
  eventId: z.string().trim().min(1).cuid()
});

export type CreateBriefingRoomData = z.infer<typeof CreateBriefingRoomBodySchema>;
