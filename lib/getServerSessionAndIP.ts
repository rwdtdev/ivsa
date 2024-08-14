import { getServerSession } from 'next-auth';
import { authConfig } from './auth-options';
import { headers } from 'next/headers';
import { getClientIP } from './helpers/ip';
import { NextAuthSession } from '@/types/auth';

export type ServerSessionAndIP = {
  session: NextAuthSession | null;
  ip: string | null;
};

export async function getServerSessionAndIP() {
  const session = await getServerSession(authConfig);
  const headersList = headers();
  const ip = getClientIP(headersList);

  return { session, ip };
}
