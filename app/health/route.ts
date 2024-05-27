import { NextRequest, NextResponse } from 'next/server';
import { IvaService } from '@/core/iva/IvaService';
import { getErrorResponse } from '@/lib/helpers';
import { S3ClientProvider } from '@/utils/s3-client/s3-client-provider';

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

type S3Healthcheck = {
  status: string;
  error?: unknown;
};

export async function GET(req: NextRequest) {
  const ivaService = new IvaService();

  const s3Client = S3ClientProvider.createClient({
    client: process.env.S3_CLIENT_TYPE,
    url: process.env.S3_CLIENT_URL,
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
    timeout: 6000,
    region: 'us-east-1',
    bucket: { asvi: process.env.S3_BUCKET_NAME },
    'auto-create-bucket': process.env.S3_AUTO_CREATE_BUCKET === 'true'
  });

  const env = {
    IVA_API_URL: process.env.IVA_API_URL,
    IVA_APP_ID: process.env.IVA_APP_ID,
    IVA_APP_SECRET: process.env.IVA_APP_SECRET,
    IVA_APP_DOMAIN_ID: process.env.IVA_APP_DOMAIN_ID
  };

  const iva: IvaHealthcheck = { status: 'OK' };
  const s3: S3Healthcheck = { status: 'OK' };

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

  try {
    const isInit = await s3Client.init();

    if (!isInit) {
      s3.status = 'NOT OK';
    }
  } catch (error) {
    s3.status = 'NOT OK';
    s3.error = getErrorResponse(error, req);
  }

  return NextResponse.json({ iva, s3 }, { status: 201 });
}
