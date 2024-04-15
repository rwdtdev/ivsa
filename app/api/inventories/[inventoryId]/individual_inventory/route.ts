import { NextRequest, NextResponse } from 'next/server';
import { getErrorResponse } from '@/lib/helpers';
import {
  CreateIndividualInventorySchema,
  PathParamsSchema,
  RemoveIndividualInvenoryPathParamsSchema,
  RemoveIndividualInvenoryQueryParamsSchema
} from './validation';

import { InventoryService } from '@/core/inventory/InventoryService';
import { InventoryObjectService } from '@/core/inventory-object/InventoryObjectService';
import { InventoryManager } from '@/core/inventory/InventoryManager';

interface IContext {
  params: {
    inventoryId: string;
    individualInventoryId: string;
    inventoryNumber: string;
    inventoryDate: Date;
    inventoryContainerObject: object;
  };
}

export async function DELETE(req: NextRequest, context: IContext) {
  const inventoryManager = new InventoryManager(
    new InventoryService(),
    new InventoryObjectService()
  );

  try {
    const { inventoryId } = RemoveIndividualInvenoryPathParamsSchema.parse(
      context.params
    );

    const { searchParams } = new URL(req.url);

    const { eventId, complexInventoryId } =
      RemoveIndividualInvenoryQueryParamsSchema.parse({
        eventId: searchParams.get('eventId'),
        complexInventoryId: searchParams.get('complexInventoryId')
      });

    await inventoryManager.removeIndividual(inventoryId, complexInventoryId, eventId);

    return new Response(null, { status: 204 });
  } catch (error) {
    return getErrorResponse(error, req);
  }
}

export async function POST(req: NextRequest, context: IContext) {
  const inventoryManager = new InventoryManager(
    new InventoryService(),
    new InventoryObjectService()
  );

  try {
    const { inventoryId } = PathParamsSchema.parse(context.params);

    const response = await inventoryManager.createIndividual({
      ...CreateIndividualInventorySchema.parse(await req.json()),
      id: inventoryId
    });

    if (response) {
      return NextResponse.json(response, { status: 200 });
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    return getErrorResponse(error, req);
  }
}
