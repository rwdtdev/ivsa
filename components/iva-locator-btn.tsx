'use client';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { boolean } from 'zod';

type Props = {
  locatorIvaLink: { locatorIvaStart: string; locatorStop: string };
};

export default function IvaLocatorBtn({ locatorIvaLink }: Props) {
  const [isLocatorStarted, setIsLocatorStarted] = useState<boolean | undefined>(
    undefined
  );

  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLocatorStarted(Boolean(localStorage.getItem('isLocatorStarted')));
    }
  }, []);

  return (
    <div className='mb-3 flex gap-3'>
      <Button className='py-6'>
        <a href={locatorIvaLink.locatorIvaStart}>Запустить Локатор</a>
      </Button>
      <Button className='py-6'>
        <a href={locatorIvaLink.locatorStop}>Остановить локатор</a>
      </Button>
    </div>
  );
}
