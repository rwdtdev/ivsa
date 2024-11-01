import { NextRequest } from 'next/server';
import { getErrorResponse } from '@/lib/helpers';
import { archiveStorage, operativeStorage } from '@/lib/storages';
import { InventoryResourceService } from '@/core/inventory-resource/InventoryResourceService';

interface IContext {
  params: { eventId: string; inventoryId: string; resourceId: string };
}

export async function GET(req: NextRequest, context: IContext) {
  const inventoryResourceService = new InventoryResourceService();
  const requestHeaders = new Headers(req.headers);
  const range = requestHeaders.get('range');

  try {
    const { eventId, inventoryId, resourceId } = context.params;
    const objectKey = `${eventId}/${inventoryId}/${resourceId}.mp4`;

    const existResource = await inventoryResourceService.getById(resourceId);
    const storage = existResource.isArchived ? archiveStorage : operativeStorage;

    const stream = range
      ? await storage.getAsStream(objectKey, range)
      : await storage.getAsStream(objectKey);

    const stats = await storage.getObjectStats(objectKey);

    if (!stats || !stats.ContentLength) {
      throw new Error("Can't get resource stats");
    }

    const videoSize = stats.ContentLength;
    const start = Number(range?.replace(/\D/g, ''));
    const end = Math.min(start + 1000_000, videoSize - 1);
    const contentLength = String(end - start + 1);

    return new Response(stream, {
      status: 206,
      headers: {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': `${stats.AcceptRanges}`,
        'Content-Length': contentLength,
        'Content-Type': `${stats.ContentType}`
      }
    });
  } catch (error) {
    return getErrorResponse(error, req);
  }
}
