import z from 'zod';

export const PathParamsSchema = z.object({
    id: z.string().trim().min(1)
});
  