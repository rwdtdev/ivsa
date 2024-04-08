import { NextRequest, NextResponse } from 'next/server';
import { IvaService } from '@/core/iva/IvaService';
import { getErrorResponse } from '@/lib/helpers';

type IvaHealthcheck = {
  status: string;
  apiVersion?: string;
  timestamp?: number;
  error?: unknown;
  isHaveAdmin?: boolean;
  env?: {
    IVA_API_URL?: string;
    IVA_APP_ID?: string;
    IVA_APP_SECRET?: string;
    IVA_APP_DOMAIN_ID?: string;
  };
};

export async function GET(req: NextRequest) {
  const ivaService = new IvaService();

  const env = {
    IVA_API_URL: process.env.IVA_API_URL,
    IVA_APP_ID: process.env.IVA_APP_ID,
    IVA_APP_SECRET: process.env.IVA_APP_SECRET,
    IVA_APP_DOMAIN_ID: process.env.IVA_APP_DOMAIN_ID
  };

  const iva: IvaHealthcheck = { status: 'OK' };

  try {
    const users = await ivaService.findUsers('');

    if (users && users.totalCount > 0) {
      iva.isHaveAdmin = users.data.some(
        (user: any) => user.userType === 'CHIEF_SYSTEM_ADMINISTRATOR'
      );
    }

    const status = await ivaService.getServerStatus();

    iva.apiVersion = status.apiVersion;
    iva.env = env;
  } catch (error) {
    console.log(error);
    iva.status = 'NOT OK';
    iva.error = getErrorResponse(error, req);
  }

  return NextResponse.json({ iva }, { status: 201 });
}
