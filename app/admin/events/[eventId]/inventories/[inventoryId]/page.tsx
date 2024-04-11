'use client';

import { getInventoryByIdAction } from '@/app/actions/server/inventories';
import Loading from '@/app/loading';
import BreadCrumb from '@/components/breadcrumb';
// import { CarouselSize } from '@/components/carousel';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Heading } from '@/components/ui/heading';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table
} from '@/components/ui/table';
import { P } from '@/components/ui/typography/p';
import { DATE_FORMAT } from '@/constants/date';
import { InventoryWithObjects } from '@/core/inventory/types';
import { getEntityId } from '@/lib/get-entity-id';
import { PlayCircle } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const breadcrumbItems = [
  {
    title: 'Реестр инвентаризаций',
    link: '/admin/events'
  },
  {
    title: 'Инвентаризационная опись',
    link: ''
  }
];

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryWithObjects>();
  const pathname = usePathname();
  const [isLoadingInventory, setIsLoadingInventory] = useState(true);

  const id = getEntityId(pathname);
  const eventId = getEntityId(pathname, 3);

  const fetchByIdAndEventId = async (id: string, eventId: string) => {
    const result = await getInventoryByIdAction(id, eventId);
    if (result) {
      setInventory(result);
      setIsLoadingInventory(false);
    }
  };

  useEffect(() => {
    if (id && eventId) {
      fetchByIdAndEventId(id, eventId);
    }
  }, []);

  if (!inventory || isLoadingInventory) {
    return <Loading />;
  }

  return (
    <div className='flex-1 space-y-4 p-8'>
      <main className='w-full pt-16'>
        <BreadCrumb items={breadcrumbItems} />
        <div className='flex items-center justify-between'>
          <Heading title='Инвентаризационная опись' description={''} />
        </div>
        <div className='grid gap-4 pt-5 lg:md:sm:grid-cols-1 xl:2xl:grid-rows-2'>
          <Card>
            <CardContent>
              <div className='my-4 space-y-4'>
                <div className='grid text-sm'>
                  <P className='text-sm'>
                    <span className='font-semibold'>Название:</span> {inventory.name}
                  </P>
                  <P className='text-sm'>
                    <span className='font-semibold'>Краткое название:</span>{' '}
                    {inventory.shortName}
                  </P>

                  <P className='text-sm'>
                    <span className='font-semibold'>Дата:</span>{' '}
                    {moment(inventory.date).format(DATE_FORMAT)}
                  </P>
                  <P className='text-sm'>
                    <span className='font-semibold'>Номер:</span> {inventory.number}
                  </P>
                  <P className='text-sm'>
                    <span className='font-semibold'>Код:</span> {inventory.code}
                  </P>
                </div>
              </div>
              <div className='grid grid-cols-10'>
                {Array.from({ length: 10 }).map((item, idx) => (
                  <Dialog key={idx}>
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
                          {moment(new Date()).format(DATE_FORMAT)}
                        </p>
                      </div>
                    </DialogTrigger>
                    <DialogContent className='max-w-[70%]'>
                      <DialogHeader>
                        <DialogTitle>Заголовок</DialogTitle>
                        <DialogDescription>
                          {moment(new Date()).format(DATE_FORMAT)}
                        </DialogDescription>
                        <video
                          src=''
                          width='100%'
                          itemType='video/mp4'
                          autoPlay
                          controls
                        ></video>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className='xl:2xl:row-span-1'>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Инв. номер</TableHead>
                    <TableHead>Локация</TableHead>
                    <TableHead>Серийный номер</TableHead>
                    <TableHead>Сетевой номер</TableHead>
                    <TableHead>Номер паспорта</TableHead>
                    <TableHead>Количество</TableHead>
                    <TableHead>Состояние</TableHead>
                    <TableHead>Наименование</TableHead>
                    <TableHead>Код ед. измерения</TableHead>
                    <TableHead>Единица измерения</TableHead>
                    <TableHead>Номер партии</TableHead>
                    <TableHead>Местоположение</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.objects.map((object, index) => (
                    <TableRow key={index}>
                      <TableCell>{object.inventoryNumber}</TableCell>
                      <TableCell>{object.location}</TableCell>
                      <TableCell>{object.serialNumber}</TableCell>
                      <TableCell>{object.networkNumber}</TableCell>
                      <TableCell>{object.passportNumber}</TableCell>
                      <TableCell>{object.quantity}</TableCell>
                      <TableCell>{object.state}</TableCell>
                      <TableCell>{object.name}</TableCell>
                      <TableCell>{object.unitCode}</TableCell>
                      <TableCell>{object.unitName}</TableCell>
                      <TableCell>{object.batchNumber}</TableCell>
                      <TableCell>{object.placement}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
