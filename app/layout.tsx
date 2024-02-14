import { Inter } from 'next/font/google';
import { ReactChildren } from '@/app/types';
import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/toaster';
import { getServerSession } from 'next-auth';

import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'АС ВИ',
  description: 'ASVI'
};

export default async function RootLayout({ children }: ReactChildren) {
  const session = await getServerSession();

  return (
    <html lang='en'>
      <body className={inter.className}>
        <Providers session={session}>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
