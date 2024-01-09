import { Inter } from 'next/font/google';
import { ReactChildren } from '@/app/types';
import Providers from 'context/providers';
import { Toaster } from '@/components/ui/toaster';

import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ASVI Application',
  description: 'ASVI Application'
};

/**
 * @TODO
 *  Need fix problem with first render, (wrapper?)
 *  when useSession in client components return null
 */
export default function RootLayout({ children }: ReactChildren) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Providers>
          <main>{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
