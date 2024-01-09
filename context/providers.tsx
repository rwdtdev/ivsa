'use client';

import { ReactChildren } from '@/app/types';
import { SessionProvider } from 'next-auth/react';

function Providers({ children }: ReactChildren) {
  return (
    <SessionProvider refetchOnWindowFocus={true}>{children}</SessionProvider>
  );
}

export default Providers;
