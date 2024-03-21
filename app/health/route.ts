import { NextResponse } from 'next/server';
import { IvaService } from '@/core/iva/IvaService';

type IvaHealthcheck = {
  status: string;
  apiVersion?: string;
  timestamp?: number;
  error: unknown;
  envDetails?: {
    IVA_API_URL?: string;
    IVA_APP_ID?: string;
    IVA_APP_SECRET?: string;
    IVA_APP_DOMAIN_ID?: string;
  };
};

export async function GET() {
  const ivaService = new IvaService();

  // Добавление деталей переменных окружения
  const envDetails = {
    IVA_API_URL: process.env.IVA_API_URL,
    IVA_APP_ID: process.env.IVA_APP_ID,
    IVA_APP_SECRET: process.env.IVA_APP_SECRET,
    IVA_APP_DOMAIN_ID: process.env.IVA_APP_DOMAIN_ID,
  };

  const iva: IvaHealthcheck = {
    status: 'OK',
    error: undefined,
    envDetails // Включение деталей переменных окружения в ответ
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
    // Нет необходимости добавлять envDetails здесь, так как они уже добавлены выше
  }

  return NextResponse.json({ iva }, { status: 201 });
}
