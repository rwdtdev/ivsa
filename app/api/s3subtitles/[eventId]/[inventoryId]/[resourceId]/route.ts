import { NextRequest } from 'next/server';
import { getErrorResponse } from '@/lib/helpers';
import { S3ClientProvider } from '@/utils/s3-client/s3-client-provider';
import { Logger } from '@/lib/logger';

interface IContext {
  params: { eventId: string; inventoryId: string; resourceId: string };
}

export async function GET(req: NextRequest, context: IContext) {
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

    const stream = await s3Client.getAsStream(
      s3Client.makeFilePath(`asvi/${eventId}/${inventoryId}/${resourceId}.vtt`)
    );

    // @ts-expect-error stream types
    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': 'video/mp4'
      }
    });
  } catch (error) {
    return getErrorResponse(error, req);
  }
}
