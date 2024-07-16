import { Inter } from 'next/font/google';
import { ReactChildren } from '@/app/types';
import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/toaster';
import { getServerSession } from 'next-auth';
import '@/styles/globals.css';
import { authConfig } from '@/lib/auth-options';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'АС ВИ',
  description: 'ASVI'
};

export default async function RootLayout({ children }: ReactChildren) {
  // @ts-expect-error change type for auth config
  const session = await getServerSession(authConfig);

  return (
    <html lang='ru'>
      <body className={inter.className}>
        <Providers session={session}>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
