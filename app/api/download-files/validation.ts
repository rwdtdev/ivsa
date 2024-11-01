import { z } from 'zod';

export const DownloadFileSchema = z.object({
  s3Url: z.string().trim().min(1),
  type: z.enum(['meta', 'video']),
  videoFileName: z.string().trim().min(1)
});

export type DownloadFileData = z.infer<typeof DownloadFileSchema>;
