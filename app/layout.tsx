import { Inter } from 'next/font/google';
import { ReactChildren } from '@/app/types';
import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/toaster';
import { getServerSession } from 'next-auth';

import '@/styles/globals.css';
import Header from '@/components/layout/header';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'АС ВИ',
  description: 'ASVI'
};

export default async function RootLayout({ children }: ReactChildren) {
  const session = await getServerSession();

  return (
    <html lang='ru'>
      <body className={inter.className}>
        {/* <div className='flex h-screen flex-col border-4 border-red-700'> */}
        <Providers session={session}>
          {/* <Header /> */}
          {children}
          <Toaster />
        </Providers>
        {/* </div> */}
      </body>
    </html>
  );
}
