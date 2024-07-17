import NextAuth from 'next-auth';
import { UserSession } from './user';
import { JWT } from 'next-auth/jwt';
import { User } from '@prisma/client';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: UserSession;
    accessToken: string;
    error: string;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    accessToken: string;
    refreshToken: string;
    user: User;
    iat: number;
    exp: number;
    jti: string;
  }
}
