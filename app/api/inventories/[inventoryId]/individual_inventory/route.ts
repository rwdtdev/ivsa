import { NextRequest } from 'next/server';
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

export async function DELETE(request: NextRequest, context: IContext) {
  const inventoryManager = new InventoryManager(
    new InventoryService(),
    new InventoryObjectService()
  );

  try {
    const { inventoryId } = RemoveIndividualInvenoryPathParamsSchema.parse(
      context.params
    );

    const { searchParams } = new URL(request.url);

    const { eventId, complexInventoryId } =
      RemoveIndividualInvenoryQueryParamsSchema.parse({
        eventId: searchParams.get('eventId'),
        inventoryId: searchParams.get('complexInventoryId')
      });

    await inventoryManager.removeIndividual(inventoryId, complexInventoryId, eventId);

    return new Response(null, { status: 204 });
  } catch (error) {
    return getErrorResponse(error);
  }
}

export async function POST(request: NextRequest, context: IContext) {
  const inventoryManager = new InventoryManager(
    new InventoryService(),
    new InventoryObjectService()
  );

  try {
    const { inventoryId } = PathParamsSchema.parse(context.params);

    await inventoryManager.createIndividual({
      ...CreateIndividualInventorySchema.parse(await request.json()),
      id: inventoryId
    });

    return new Response(null, { status: 201 });
  } catch (error) {
    return getErrorResponse(error);
  }
}
