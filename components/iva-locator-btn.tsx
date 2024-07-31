'use client';
import { Button } from '@/components/ui/button';

type Props = {
  locatorIvaLink: { locatorIvaStart: string; locatorStop: string };
};

export default function IvaLocatorBtn({ locatorIvaLink }: Props) {
  const { locatorIvaStart, locatorStop } = locatorIvaLink;

  return (
    <>
      <Button className='mb-4 h-12 w-full rounded-xl p-0' variant='destructive'>
        <a href={locatorStop} className='w-full p-4'>
          Остановить сбор гео-данных
        </a>
      </Button>

      <Button className='mb-4 w-full rounded-xl p-0' asChild>
        <a href={locatorIvaStart} className='block w-full py-8'>
          Запустить сбор гео-данных <br /> и перейти в видео-конференцию
        </a>
      </Button>
    </>
  );
}
