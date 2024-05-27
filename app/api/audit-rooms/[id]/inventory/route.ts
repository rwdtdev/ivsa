import { NextRequest, NextResponse } from 'next/server';
import { InventoryService } from '@/core/inventory/InventoryService';
import { getErrorResponse } from '@/lib/helpers';
import { PathParamsSchema } from './validation';

interface IContext {
  params: { id: string };
}

export async function GET(req: NextRequest, context: IContext) {
  const inventoryService = new InventoryService();

  try {
    const { id } = PathParamsSchema.parse(context.params);

    const inventory = await inventoryService.getByConferenceId(id);

    return NextResponse.json(inventory, { status: 200 });
  } catch (error) {
    return getErrorResponse(error, req);
  }
}
