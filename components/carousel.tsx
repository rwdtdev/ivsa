import * as React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { random } from 'underscore';
import { DownloadCloudIcon, PlayCircleIcon } from 'lucide-react';
import { useToast } from './ui/use-toast';

const items = Array.from({ length: 10 });

export function CarouselSize() {
  const { toast } = useToast();

  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true
      }}
      className='col-span-4 col-start-2 w-full max-w-lg'
    >
      <CarouselContent>
        {items.map((_, index) => (
          <CarouselItem
            key={index}
            className={items.length < 4 ? 'basis-auto' : 'basis-1/8'}
          >
            <div className='p-1'>
              <div className='flex h-20 w-20 items-center justify-center'>
                <div className='grid h-full w-full grid-cols-2 items-center justify-center border border-black'>
                  {/* <img src='/stub.jpg' className='z-0  rounded-md'></img> */}
                  <div className='group/item flex h-full cursor-pointer items-center justify-center transition duration-150 ease-in-out hover:bg-black'>
                    <DownloadCloudIcon
                      width={24}
                      height={24}
                      color='white'
                      onClick={() => {
                        console.log('Download video!');
                        alert('Download video!');
                      }}
                      className='group/edit invisible h-full transition delay-100 duration-300 ease-in-out group-hover/item:visible group-hover/item:-translate-y-1 group-hover/item:text-white'
                    />
                  </div>
                  <div className='group/item flex h-full cursor-pointer items-center justify-center transition duration-150 ease-in-out hover:bg-black'>
                    <PlayCircleIcon
                      width={24}
                      height={24}
                      color='white'
                      onClick={() => {
                        console.log('Play video!');
                        alert('Play video!');
                      }}
                      className='group/edit invisible h-full items-center justify-center transition delay-100 duration-300 ease-in-out group-hover/item:visible group-hover/item:-translate-y-1 group-hover/item:text-white'
                    />
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
