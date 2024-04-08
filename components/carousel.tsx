import * as React from 'react';
import moment from 'moment';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { PlayCircle } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { DATE_FORMAT } from '@/constants/date';
import Image from 'next/image';

export function CarouselSize({ items }: { items: any[] }) {
  return (
    <Carousel opts={{ align: 'start' }} className='grid grid-flow-col'>
      <div className='m-auto flex justify-start'>
        <CarouselPrevious />
      </div>
      <div className='xs:col-span-1 px-2 sm:min-w-[100px] md:min-w-[300px] xl:col-span-2 xl:min-w-[850px] 2xl:col-span-6 2xl:min-w-[490px]'>
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem key={index} className='basis-[120px]'>
              <div className='p-1'>
                <Dialog>
                  <DialogTrigger>
                    <div>
                      <div className='group relative grid h-full w-full items-center justify-center'>
                        <Image
                          src='/stub.jpg'
                          alt='image'
                          width={120}
                          height={100}
                          className='rounded-md opacity-70 group-hover:opacity-100'
                        />
                        <PlayCircle
                          className='invisible absolute w-full text-white opacity-80 group-hover:visible'
                          size={48}
                        />
                      </div>
                      <p className='text-xs text-muted-foreground'>
                        {moment(item.date).format(DATE_FORMAT)}
                      </p>
                    </div>
                  </DialogTrigger>
                  <DialogContent className='max-w-[70%]'>
                    <DialogHeader>
                      <DialogTitle>{item.title}</DialogTitle>
                      <DialogDescription>
                        {moment(item.date).format(DATE_FORMAT)}
                      </DialogDescription>
                      <video
                        src={item.url}
                        width='100%'
                        itemType='video/mp4'
                        autoPlay
                        controls
                      ></video>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </div>
      <div className='m-auto flex justify-end'>
        <CarouselNext />
      </div>
    </Carousel>
  );
}
