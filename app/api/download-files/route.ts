import { ActionService } from '@/core/action/ActionService';
import { getMonitoringInitData } from '@/lib/getMonitoringInitData';
import { Logger } from '@/lib/logger';
import { S3ClientProvider } from '@/utils/s3-client/s3-client-provider';
import { ActionStatus, ActionType } from '@prisma/client';

export async function POST(req: Request) {
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
  const data = await req.json();
  const actionService = new ActionService();
  const { ip, initiator } = await getMonitoringInitData();

  try {
    if (data.type === 'video') {
      // console.log(`asvi/${data.s3Url}.mp4`);

      const stream = await s3Client.getAsStream(
        s3Client.makeFilePath(`asvi/${data.s3Url}.mp4`)
      );

      actionService.add({
        ip,
        initiator,
        type: ActionType.USER_DOWNLOAD_FILE,
        status: ActionStatus.SUCCESS
      });
      // @ts-expect-error stream types
      return new Response(stream, {
        status: 200,
        headers: {
          'Content-Type': 'video/mp4'
        }
      });
    } else {
      // console.log(`asvi/${data.s3Url}_subtitles.vtt`);
      const stream = await s3Client.getAsStream(
        s3Client.makeFilePath(`asvi/${data.s3Url}_subtitles.vtt`)
      );

      // @ts-expect-error stream types
      return new Response(stream, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }
  } catch (err) {
    actionService.add({
      ip,
      initiator,
      type: ActionType.USER_DOWNLOAD_FILE,
      status: ActionStatus.ERROR,
      details: {
        error: err
      }
    });
    console.error(err);
  }
}
