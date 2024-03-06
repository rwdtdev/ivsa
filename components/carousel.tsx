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
  }
];

export function CarouselSize() {
  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true
      }}
      className='col-span-4 col-start-2 w-full max-w-lg'
    >
      <CarouselContent>
        {items.map((item, index) => (
          <CarouselItem
            key={index}
            className={items.length < 4 ? 'basis-auto' : 'basis-1/8'}
          >
            <Dialog>
              <DialogTrigger>
                <div className='p-1'>
                  <div className='group relative flex h-20 w-20 items-center justify-center'>
                    <Image
                      src='/stub.jpg'
                      alt='image'
                      width={120}
                      height={100}
                      className='absolute rounded-md opacity-70 group-hover:opacity-100'
                    />
                    <PlayCircle
                      className='invisible absolute text-white opacity-80 group-hover:visible'
                      size={32}
                    />
                  </div>
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
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
