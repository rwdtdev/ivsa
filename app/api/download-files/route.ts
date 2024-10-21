import { DownloadFileData } from '@/components/tables/videos-table/downLoadFilesBtn';
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
      region: process.env.S3_REGION,
      bucket: { asvi: process.env.S3_BUCKET_NAME },
      'auto-create-bucket': process.env.S3_AUTO_CREATE_BUCKET === 'true'
    },
    new Logger({ name: 's3-client' })
  );
  const data: DownloadFileData = await req.json();
  const actionService = new ActionService();
  const { ip, initiator, initiatorName } = await getMonitoringInitData();

  try {
    if (data.type === 'video') {
      const stream = await s3Client.getAsStream(
        s3Client.makeFilePath(`asvi/${data.s3Url}.mp4`)
      );
      const found = await s3Client.findFile(`asvi/${data.s3Url}.mp4`);
      const stats = await s3Client.statObject(found[0].bucket, found[0].fileName);

      if (!stream) {
        throw new Error(`файл ${data.videoFileName} не найден`);
      }

      actionService.add({
        ip,
        initiator,
        type: ActionType.USER_DOWNLOAD_FILE,
        status: ActionStatus.SUCCESS,
        details: {
          name: initiatorName,
          videoFileName: data.videoFileName,
          hashFileName: `${data.videoFileName.slice(0, -4)}-videohash.txt`,
          hashFileSize: '64 байт',
          videoFileSize: `${stats?.size} байт`
        }
      });
      // @ts-expect-error stream types
      return new Response(stream, {
        status: 200,
        headers: {
          'Content-Type': 'video/mp4'
        }
      });
    } else if (data.type === 'meta') {
      // console.log(`asvi/${data.s3Url}_subtitles.vtt`);
      const stream = await s3Client.getAsStream(
        s3Client.makeFilePath(`asvi/${data.s3Url}_subtitles.vtt`)
      );
      actionService.add({
        ip,
        initiator,
        type: ActionType.USER_DOWNLOAD_FILE,
        status: ActionStatus.SUCCESS,
        details: { name: initiatorName }
      });
      // @ts-expect-error stream types
      return new Response(stream, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }
  } catch (err) {
    if (err instanceof Error) {
      actionService.add({
        ip,
        initiator,
        type: ActionType.USER_DOWNLOAD_FILE,
        status: ActionStatus.ERROR,
        details: {
          error: err.message
        }
      });
    }
    console.error(err);
  }
}
