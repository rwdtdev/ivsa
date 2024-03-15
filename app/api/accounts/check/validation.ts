import { z } from 'zod';

export const CheckTabelNumbersSchema = z.object({
  tabelNumbers: z.array(z.string().trim().length(8)).min(1)
});
