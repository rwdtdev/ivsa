import { NextRequest, NextResponse } from 'next/server';
import { getErrorResponse } from '@/lib/helpers';
import { CreateDivisionHierarchySchema } from './validation';
import { DivisionHierarchyService } from '@/core/division-hierarchy/DivisionHierarchyService';
import { CreateDivisionHierarchyDTO } from './dtos/create-division-hierarchy.dto';
import { doTransaction } from '@/lib/prisma-transaction';
import { TransactionSession } from '@/types/prisma';

export async function POST(req: NextRequest) {
  try {
    const params = CreateDivisionHierarchySchema.parse(await req.json());

    const response = await doTransaction(async (session: TransactionSession) => {
      const divisionHierarchyService = new DivisionHierarchyService(session);

      return await divisionHierarchyService.create(
        new CreateDivisionHierarchyDTO(params)
      );
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return getErrorResponse(error, req);
  }
}

export async function GET(req: NextRequest) {
  const divisionHierarchyService = new DivisionHierarchyService();

  try {
    const response = await divisionHierarchyService.getAll();

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return getErrorResponse(error, req);
  }
}
