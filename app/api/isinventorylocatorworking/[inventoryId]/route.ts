import { getErrorResponse } from '@/lib/helpers';
import prisma from '@/core/prisma';

type ResponseType = {
  isLocatorWorking: undefined | boolean;
  isMoreOneMin: boolean;
};

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

    const response: ResponseType = {
      isLocatorWorking: false,
      isMoreOneMin: lastInventoryLocation[0].createdAt.getTime() + 65000 < Date.now()
    };
    if (lastInventoryLocation[0].createdAt.getTime() + 5000 > Date.now()) {
      response.isLocatorWorking = true;
    } else if (
      lastInventoryLocation[0].createdAt.getTime() + 5000 < Date.now() &&
      lastInventoryLocation[0].createdAt.getTime() + 65000 > Date.now()
    ) {
      response.isLocatorWorking = undefined;
    }
    console.log(
      'нужен(?) сервис получения lastInventoryLocation',
      lastInventoryLocation[0].createdAt,
      new Date(lastInventoryLocation[0].createdAt.getTime() + 65000),
      new Date(),
      response.isLocatorWorking,
      lastInventoryLocation[0].createdAt.getTime() + 65000 - Date.now()
    );
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (err) {
    return getErrorResponse(err, req);
  }
}
