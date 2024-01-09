'use client';

import React from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

const Main = () => {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div style={{ textAlign: 'center' }}>
        <p>
          Hi, {session.user.name} ({session.user.email})
        </p>
        <button style={{ padding: '5px' }} onClick={() => signOut()}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <p>Hi, Anonymus.</p>
      <Link href='/login'>
        <button style={{ padding: '5px' }}>Login</button>
      </Link>
    </div>
  );
};

export default Main;
