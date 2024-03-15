/**
 * @TODO Delete that route after integration testing
 */

import { NextRequest, NextResponse } from 'next/server';
import { getErrorResponse } from '@/lib/helpers';

import { ParticipantService } from '@/core/participant/ParticipantService';

import { UserManager } from '@/core/user/UserManager';
import { IvaService } from '@/core/iva/IvaService';
import { UserService } from '@/core/user/UserService';
import { DepartmentService } from '@/core/department/DepartmentService';
import { OrganisationService } from '@/core/organisation/OrganisationService';

export async function POST(request: NextRequest) {
  const userManager = new UserManager(
    new IvaService(),
    new UserService(),
    new DepartmentService(),
    new ParticipantService(),
    new OrganisationService()
  );

  try {
    const requestBody = await request.json();

    const user = await userManager.createUser(requestBody);

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return getErrorResponse(error);
  }
}

export async function GET() {
  const userManager = new UserManager(
    new IvaService(),
    new UserService(),
    new DepartmentService(),
    new ParticipantService(),
    new OrganisationService()
  );

  try {
    const users = await userManager.getAll();

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return getErrorResponse(error);
  }
}
