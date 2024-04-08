import { NextRequest, NextResponse } from 'next/server';
import { getErrorResponse } from '@/lib/helpers';
import { GetInventoryPortalLinkPathParamsSchema } from './validation';
import { InventoryService } from '@/core/inventory/InventoryService';

interface IContext {
  params: {
    eventId: string;
    inventoryId: string;
  };
}

export async function GET(req: NextRequest, context: IContext) {
  const inventoryService = new InventoryService();

  try {
    const { inventoryId, eventId } = GetInventoryPortalLinkPathParamsSchema.parse(
      context.params
    );

    await inventoryService.assertExistAndBelongEvent(inventoryId, eventId);

    return NextResponse.json(
      { portalLink: `${process.env.NEXTAUTH_URL}/admin/inventories/${inventoryId}` },
      { status: 200, statusText: 'OK' }
    );
  } catch (error) {
    return getErrorResponse(error, req);
  }
}
