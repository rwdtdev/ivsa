import { getServerSession } from 'next-auth';
import { authConfig } from './auth-options';
import { headers } from 'next/headers';
import { getClientIP } from './helpers/ip';
import { NextAuthSession } from '@/types/auth';
import { unknownUser } from '@/constants/actions';

export type MonitoringInitData = {
  ip: string;
  initiator: string;
  initiatorName: string;
  session: NextAuthSession | null;
};

// export async function getServerSessionAndIP() {
export async function getMonitoringInitData(): Promise<MonitoringInitData> {
  const session = await getServerSession(authConfig);
  const initiator = session?.user.username || unknownUser;
  const initiatorName = session?.user.name || unknownUser;
  const headersList = headers();
  const ip = getClientIP(headersList) || 'ip не определен';

  return { ip, initiator, initiatorName, session };
}
