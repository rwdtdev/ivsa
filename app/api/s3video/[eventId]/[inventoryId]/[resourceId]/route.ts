import { NextRequest } from 'next/server';
import { getErrorResponse } from '@/lib/helpers';
import { S3ClientProvider } from '@/utils/s3-client/s3-client-provider';
import { Logger } from '@/lib/logger';

interface IContext {
  params: { eventId: string; inventoryId: string; resourceId: string };
}

export async function GET(req: NextRequest, context: IContext) {
  const requestHeaders = new Headers(req.headers);
  const range = requestHeaders.get('range');

  try {
    const { eventId, inventoryId, resourceId } = context.params;

    const s3Client = S3ClientProvider.createClient(
      {
        client: process.env.S3_CLIENT_TYPE,
        url: process.env.S3_CLIENT_URL,
        accessKey: process.env.S3_ACCESS_KEY,
        secretKey: process.env.S3_SECRET_KEY,
        timeout: 6000,
        region: 'us-east-1',
        bucket: { asvi: process.env.S3_BUCKET_NAME },
        'auto-create-bucket': process.env.S3_AUTO_CREATE_BUCKET === 'true'
      },
      new Logger({ name: 's3-client' })
    );

    const filePath = s3Client.makeFilePath(
      `asvi/${eventId}/${inventoryId}/${resourceId}.mp4`
    );

    const stats = await s3Client.getObjectStats(filePath);

    if (!stats) {
      throw new Error('error in s3Client.getObjectStats(filePath)');
    }

    const videoSize = stats.size;
    const start = Number(range?.replace(/\D/g, ''));
    const end = Math.min(start + 1000_000, videoSize - 1);

    const stream = await s3Client.getAsStreamWithRange(filePath, start, end);
    if (!stream) {
      throw new Error('error in s3Client.getAsStreamWithRange(filePath, start, end)');
    }
    const contentLength = String(end - start + 1);
    return new Response(stream, {
      status: 206,
      headers: {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': 'video/mp4'
      }
    });
  } catch (error) {
    return getErrorResponse(error, req);
  }
}
