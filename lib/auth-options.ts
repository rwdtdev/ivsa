import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { login } from '@/server/services/users';

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
      async authorize(credentials): Promise<any> {
        if (!credentials?.username || !credentials.password) {
          return null;
        }

        try {
          const user = await login({
            username: credentials.username,
            password: credentials.password
          });

          if (user) {
            return user;
          }

          return null;
        } catch (err) {
          return null;
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
