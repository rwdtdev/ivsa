import ip6addr from 'ip6addr';

const isLoopBack = (ip: string) => ip === '127.0.0.1' || ip === '::1';

export const getClientIP = (headers: Headers): string | null => {
  let ip = headers.get('x-real-ip');

  const forwardedFor = headers.get('x-forwarded-for');

  if (!ip && forwardedFor) {
    ip = forwardedFor;
  }

  if (!ip) return null;

  if (isLoopBack(ip)) {
    ip = '127.0.0.1';
  }

  return ip6addr.parse(ip).toString({ format: 'v4' });
};
