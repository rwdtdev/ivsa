import NextAuth from 'next-auth';
import { UserSession } from './user';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: UserSession;
    accessToken: string;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    accessToken: string;
    user: Omit<UserSession, 'expiresAt' | 'tabelNumber' | 'ivaProfileId'>;
    iat: number;
    exp: number;
    jti: string;
  }
}
