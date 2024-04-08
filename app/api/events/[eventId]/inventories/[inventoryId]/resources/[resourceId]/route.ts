import { NextRequest } from 'next/server';
import { getErrorResponse } from '@/lib/helpers';

import { S3ClientProvider } from '@/utils/s3-client/s3-client-provider';
import { Logger } from '@/lib/logger';

interface IContext {
  params: { eventId: string; inventoryId: string; resourceId: string };
}

export async function GET(request: NextRequest, context: IContext) {
  try {
    const { eventId, inventoryId, resourceId } = context.params;

    const s3Client = S3ClientProvider.createClient(
      {
        client: 'minio',
        url: 'http://127.0.0.1:9000',
        accessKey: 'admin',
        secretKey: 'admin123',
        timeout: 6000,
        region: 'us-east-1',
        bucket: { asvi: 'asvi' },
        'auto-create-bucket': true
      },
      new Logger({ name: 's3-client' })
    );

    const stream = await s3Client.getAsStream(
      s3Client.makeFilePath(`asvi/${eventId}/${inventoryId}/${resourceId}.mp4`)
    );

    // @ts-expect-error stream types
    return new Response(stream);
  } catch (error) {
    return getErrorResponse(error);
  }
}
