import { IvaService } from '@/core/iva/IvaService';
import { ParticipantService } from '@/core/participant/ParticipantService';
import { UserManager } from '@/core/user/UserManager';
import { UserService } from '@/core/user/UserService';
import { getErrorResponse } from '@/lib/helpers';
import { NextRequest } from 'next/server';
import { PathParamsSchema } from './validation';

interface IContext {
  params: { id: string };
}

export async function POST(req: NextRequest, context: IContext) {
  const userManager = new UserManager(
    new IvaService(),
    new UserService(),
    new ParticipantService()
  );

  try {
    const { id } = PathParamsSchema.parse(context.params);
    await userManager.unblockUser(id);

    return new Response(null, { status: 204 });
  } catch (error) {
    return getErrorResponse(error, req);
  }
}
