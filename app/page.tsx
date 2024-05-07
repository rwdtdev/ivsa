'use client';

import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function Main() {
  const { data: session } = useSession();

  if (!session || !session.user) {
    redirect('/login');
  }

  return (
    <div className='text-center'>
      <p>
        Hi, {session?.user?.name} ({session?.user?.email})
      </p>
      <button className='p-5' onClick={() => signOut({ callbackUrl: '/login' })}>
        Logout
      </button>
    </div>
  );
}
