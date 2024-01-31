'use client';

import * as React from 'react';
import { Progress } from '@/components/ui/progress';

export default function Loading() {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main
      style={{
        textAlign: 'center',
        alignContent: 'center',
        verticalAlign: 'middle'
      }}
    >
      <section>
        <div className='layout flex min-h-screen flex-col items-center justify-center text-center text-black'>
          <Progress value={progress} className='w-[30%]' />
        </div>
      </section>
    </main>
  );
}
