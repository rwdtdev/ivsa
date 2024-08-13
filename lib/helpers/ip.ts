import ip6addr from 'ip6addr';
import { NextRequest } from 'next/server';

const isLoopBack = (ip: string) => ip === '127.0.0.1' || ip === '::1';

export const getClientIP = (req: NextRequest): string | null => {
  let ip = req.headers.get('x-real-ip');

  const forwardedFor = req.headers.get('x-forwarded-for');

  if (!ip && forwardedFor) {
    ip = forwardedFor;
  }

  if (!ip) return null;

  if (isLoopBack(ip)) {
    ip = '127.0.0.1';
  }

  return ip6addr.parse(ip).toString({ format: 'v4' });
};
