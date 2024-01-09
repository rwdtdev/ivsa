import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { login } from '@/server/services/users';
import ApiError from '@/server/utils/error';

export const authConfig: AuthOptions = {
  pages: {
    signIn: '/login'
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'username', type: 'text' },
        password: { label: 'password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials.password) {
          return null;
        }

        try {
          const user = await login({
            username: credentials.username,
            password: credentials.password
          });

          return user;
        } catch (err) {
          throw err;
        }
      }
    })
  ]
  // callbacks: {
  //   async jwt({ token, user }) {
  //     if (user) {
  //       token.email = user.email;
  //       token.name = user.name;
  //     }
  //     return token;
  //   },
  //   async session({ session, token }) {
  //     if (token) {
  //       session.user = {
  //         ...session.user,
  //         email: token.email,
  //         name: token.name
  //       };
  //     }
  //     return session;
  //   }
  // }
};
