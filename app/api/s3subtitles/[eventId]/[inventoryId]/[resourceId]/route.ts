import { NextRequest } from 'next/server';
import { getErrorResponse } from '@/lib/helpers';
import { InventoryResourceService } from '@/core/inventory-resource/InventoryResourceService';
import { archiveStorage, operativeStorage } from '@/lib/storages';

interface IContext {
  params: { eventId: string; inventoryId: string; resourceId: string };
}

export async function GET(req: NextRequest, context: IContext) {
  const inventoryResourceService = new InventoryResourceService();

  try {
    const { eventId, inventoryId, resourceId } = context.params;

    const existResource = await inventoryResourceService.getById(resourceId);
    const storage = existResource.isArchived ? archiveStorage : operativeStorage;

    const stream = await storage.getAsStream(
      `/${eventId}/${inventoryId}/${resourceId}_subtitles.vtt`
    );

    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  } catch (error) {
    return getErrorResponse(error, req);
  }
}
