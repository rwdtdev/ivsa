'use client';

import React from 'react';
import { useEffect } from 'react';
import { RiAlarmWarningFill } from 'react-icons/ri';

type ClientError = {
  error: Error & { digest?: string };
};

export default function Error({ error }: ClientError) {
  useEffect(() => console.error(error), [error]);

  return (
    <main
      style={{
        textAlign: 'center',
        alignContent: 'center',
        verticalAlign: 'middle'
      }}
    >
      <section className='bg-white'>
        <div className='layout flex min-h-screen flex-col items-center justify-center text-center text-black'>
          <RiAlarmWarningFill
            size={60}
            className='drop-shadow-glow animate-flicker text-red-500'
          />
          <h1 className='mt-8 text-4xl md:text-6xl'>
            Oops, something went wrong!
          </h1>
        </div>
      </section>
    </main>
  );
}
