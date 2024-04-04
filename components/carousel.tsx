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

// @TODO: Заглушка
const items = [
  {
    title: 'Опись №1',
    url: '/test.mp4',
    date: new Date()
  },
  {
    title: 'Опись №2',
    url: '/test.mp4',
    date: new Date()
  },
  {
    title: 'Опись №3',
    url: '/test.mp4',
    date: new Date()
  },
  {
    title: 'Опись №4',
    url: '/test.mp4',
    date: new Date()
  },
  {
    title: 'Опись №5',
    url: '/test.mp4',
    date: new Date()
  },
  {
    title: 'Опись №6',
    url: '/test.mp4',
    date: new Date()
  },
  {
    title: 'Опись №7',
    url: '/test.mp4',
    date: new Date()
  },
  {
    title: 'Опись №8',
    url: '/test.mp4',
    date: new Date()
  },
  {
    title: 'Опись №9',
    url: '/test.mp4',
    date: new Date()
  },
  {
    title: 'Опись №10',
    url: '/test.mp4',
    date: new Date()
  },
  {
    title: 'Опись №11',
    url: '/test.mp4',
    date: new Date()
  },
  {
    title: 'Опись №12',
    url: '/test.mp4',
    date: new Date()
  }
];

export function CarouselSize() {
  return (
    <Carousel
      opts={{
        align: 'start'
      }}
      className='grid grid-flow-col'
    >
      <div className='m-auto flex w-full justify-start'>
        <CarouselPrevious />
      </div>
      <div className='col-span-6 px-2'>
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
                      <video src={item.url} width='100%' autoPlay controls></video>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </div>
      <div className='m-auto flex w-full justify-end'>
        <CarouselNext />
      </div>
    </Carousel>
  );
}
