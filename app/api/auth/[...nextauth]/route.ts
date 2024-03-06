import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth-options';

// @ts-expect-error change type for auth config
const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
