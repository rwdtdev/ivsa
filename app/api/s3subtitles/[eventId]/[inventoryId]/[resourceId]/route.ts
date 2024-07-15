import { NextRequest } from 'next/server';
import { getErrorResponse } from '@/lib/helpers';
import { S3ClientProvider } from '@/utils/s3-client/s3-client-provider';
import { Logger } from '@/lib/logger';
import { isS3ClientMinio } from '@/utils/s3-client/isS3ClientMinio';

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

    if (isS3ClientMinio(s3Client)) {
      const stream = await s3Client.getAsStream(
        s3Client.makeFilePath(
          `asvi/${eventId}/${inventoryId}/${resourceId}_subtitles.vtt`
        )
      );

      // @ts-expect-error stream types
      return new Response(stream, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    } else {
      throw new Error(
        'getAsStrem & getObjectStats methods for S3ClientSbercloud must be implemented'
      );
    }
  } catch (error) {
    return getErrorResponse(error, req);
  }
}
