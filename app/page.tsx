'use client';

import React from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function Main() {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div className='text-center'>
        <p>
          Hi, {session.user.name} ({session.user.email})
        </p>
        <button className='p-5' onClick={() => signOut()}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className='text-center'>
      <p>Hi, Anonymus.</p>
      <Link href='/login'>
        <button className='p-5'>Login</button>
      </Link>
    </div>
  );
}
