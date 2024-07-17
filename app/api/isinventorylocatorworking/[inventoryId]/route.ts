import { getErrorResponse } from '@/lib/helpers';
import prisma from '@/core/prisma';

export async function GET(req: Request, { params }: { params: { inventoryId: string } }) {
  try {
    const lastInventoryLocation = await prisma.inventoryLocation.findMany({
      where: {
        inventoryId: params.inventoryId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 1
    });

    console.log('нужен(?) сервис получения lastInventoryLocation');
    const response = { isLocatorWorking: false };
    if (lastInventoryLocation[0].createdAt.getTime() + 65000 > Date.now()) {
      response.isLocatorWorking = true;
    }
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (err) {
    return getErrorResponse(err, req);
  }
}
