import { ActionService } from '@/core/action/ActionService';
import { InventoryResourceService } from '@/core/inventory-resource/InventoryResourceService';
import { getMonitoringInitData } from '@/lib/getMonitoringInitData';
import { getErrorResponse } from '@/lib/helpers';
import { archiveStorage, operativeStorage } from '@/lib/storages';
import { ActionStatus, ActionType } from '@prisma/client';
import { DownloadFileData } from './validation';
import { getLastItem } from '@/lib/helpers/string';

export async function POST(req: Request) {
  const inventoryResourceService = new InventoryResourceService();

  const data: DownloadFileData = await req.json();

  const actionService = new ActionService();
  const { ip, initiator, initiatorName } = await getMonitoringInitData();

  try {
    const resourceId = getLastItem(data.s3Url, '/');

    if (!resourceId) {
      throw new Error("Can't parse s3Url, has incorrect format");
    }

    const existResource = await inventoryResourceService.getById(resourceId);
    const storage = existResource.isArchived ? archiveStorage : operativeStorage;

    if (data.type === 'video') {
      const objectKey = `${data.s3Url}.mp4`;

      const stream = await storage.getAsStream(objectKey);
      const stats = await storage.getObjectStats(objectKey);

      if (!stream) {
        throw new Error(`Файл ${data.videoFileName} не найден`);
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
          videoFileSize: `${stats.ContentLength} байт`
        }
      });
      return new Response(stream, {
        status: 200,
        headers: { 'Content-Type': 'video/mp4' }
      });
    } else if (data.type === 'meta') {
      const stream = await storage.getAsStream(`${data.s3Url}_subtitles.vtt`);

      actionService.add({
        ip,
        initiator,
        type: ActionType.USER_DOWNLOAD_FILE,
        status: ActionStatus.SUCCESS,
        details: { name: initiatorName }
      });

      return new Response(stream, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      actionService.add({
        ip,
        initiator,
        type: ActionType.USER_DOWNLOAD_FILE,
        status: ActionStatus.ERROR,
        details: {
          error: error.message
        }
      });
    }
    return getErrorResponse(error, req);
  }
}
