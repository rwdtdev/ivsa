import * as z from 'zod';

export const searchParamsSchema = z.object({
  page: z.string().default('1'),
  per_page: z.string().default('10'),
  sort: z.string().optional(),
  name: z.string().optional(),
  title: z.string().optional(),
  type: z.string().optional(),
  store: z.string().optional(),
  status: z.string().optional(),
  role: z.string().optional(),
  operator: z.string().optional(),
  search: z.string().optional(),
  department: z.string().optional(),
  organisation: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  briefingStatus: z.string().optional(),
  expiresAt: z.string().optional()
});
