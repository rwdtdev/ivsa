import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { login } from '@/server/services/auth/login';
import { refresh } from '@/server/services/auth/refresh';
import { JwtCallbackOptions, SessionCallbackOptions, AuthorizedUser } from '@/types/auth';

export const authConfig = {
  pages: { signIn: '/login' },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'username', type: 'text' },
        password: { label: 'password', type: 'password' }
      },
      async authorize(credentials): Promise<AuthorizedUser | null> {
        try {
          const user = await login({
            username: credentials?.username,
            password: credentials?.password
          });

          return user ? user : null;
        } catch (err) {
          console.error(err);
          return null;
        }
      }
    })
  ],
  callbacks: {
    // @ts-expect-error types
    jwt: async ({ token, user }: JwtCallbackOptions) => {
      const isSignIn = !!user;

      // Save access and refresh tokens in JWT on initial login
      if (isSignIn) {
        const { accessToken, refreshToken, ...payload } = user;
        return {
          accessToken,
          refreshToken,
          user: payload
        };
      }

      if (token && token.exp) {
        // If access token is not expire return it
        if (Date.now() < token.exp * 1000) {
          return token;
        }

        // Try to generate new access token with refresh token in JWT
        try {
          const newAccessToken = await refresh(token.refreshToken);

          return { ...token, accessToken: newAccessToken };
        } catch (err) {
          console.error('Error refreshing access token', err);
          return { ...token, error: 'RefreshAccessTokenError' };
        }
      }
    },
    // @ts-expect-error types
    session: async ({ session, token }: SessionCallbackOptions) => {
      if (token) {
        session.user = token.user;
        session.accessToken = token.accessToken;

        if (token.error) {
          session.error = token.error;
        }
      }

      return session;
    }
  }
} satisfies NextAuthOptions;
