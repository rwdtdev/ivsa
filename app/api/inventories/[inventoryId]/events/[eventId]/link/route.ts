import { NextRequest, NextResponse } from 'next/server';

import { getErrorResponse } from '@/lib/helpers';
import { GetInventoryPortalLinkPathParamsSchema } from './validation';
import { InventoryService } from '@/core/inventory/InventoryService';
import { assertAPICallIsAuthorized } from '@/lib/api/helpers';

interface iContext {
  params: {
    eventId: string;
    inventoryId: string;
  };
}

export async function GET(request: NextRequest, context: iContext) {
  const inventoryService = new InventoryService();

  try {
    assertAPICallIsAuthorized(request);

    const { inventoryId, eventId } = GetInventoryPortalLinkPathParamsSchema.parse(
      context.params
    );

    await inventoryService.assertExistAndBelongEvent(inventoryId, eventId);

    return NextResponse.json(
      { portalLink: `${process.env.NEXTAUTH_URL}/admin/inventories/${inventoryId}` },
      { status: 200, statusText: 'OK' }
    );
  } catch (error) {
    return getErrorResponse(error);
  }
}
