import { NextResponse } from 'next/server';
import { IvaService } from '@/core/iva/IvaService';

type IvaHealthcheck = {
  status: string;
  apiVersion?: string;
  timestamp?: number;
  error: unknown;
};

export async function GET() {
  const ivaService = new IvaService();

  const iva: IvaHealthcheck = {
    status: 'OK',
    error: undefined
  };

  try {
    const status = await ivaService.getServerStatus();

    if (status) {
      iva.apiVersion = status.apiVersion;
      iva.timestamp = status.timestamp;
    }
  } catch (err) {
    iva.status = 'NOT OK';
    iva.error = err;
  }

  return NextResponse.json({ iva }, { status: 201 });
}
