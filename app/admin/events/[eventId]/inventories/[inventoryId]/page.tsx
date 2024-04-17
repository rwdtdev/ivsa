'use client';

import { getInventoryByIdAction } from '@/app/actions/server/inventories';
import {
  PaginatedInventoryObject,
  getInventoryObjectsByInventoryIdAction
} from '@/app/actions/server/inventoryObjects';
import Loading from '@/app/loading';
import BreadCrumb from '@/components/breadcrumb';
import { InventoryObjectsTable } from '@/components/tables/inventory-objects-table';
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
import { ScrollArea } from '@/components/ui/scroll-area';

import { P } from '@/components/ui/typography/p';
import { DATE_FORMAT } from '@/constants/date';
import { InventoryCode } from '@/core/inventory/types';
import { getEntityId } from '@/lib/get-entity-id';
import { SearchParams } from '@/types';
import { Inventory } from '@prisma/client';
import { PlayCircle } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export interface IndexPageProps {
  searchParams: SearchParams;
}

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

export default function InventoryPage({ searchParams }: IndexPageProps) {
  const [inventory, setInventory] = useState<Inventory>();
  const [inventoryObjects, setInventoryObjects] = useState<PaginatedInventoryObject>();
  const pathname = usePathname();
  const [isLoadingInventory, setIsLoadingInventory] = useState(true);

  const id = getEntityId(pathname);
  const eventId = getEntityId(pathname, 3);

  const fetchByIdAndEventId = async (id: string, eventId: string) => {
    const result = await getInventoryByIdAction(id, eventId);
    if (result) {
      setInventory(result);

      const inventoryObjects = await getInventoryObjectsByInventoryIdAction(
        result.id,
        searchParams
      );
      setInventoryObjects(inventoryObjects);
      setIsLoadingInventory(false);
    }
  };

  useEffect(() => {
    if (id && eventId) {
      fetchByIdAndEventId(id, eventId);
    }
  }, [searchParams]);

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
        <div className='grid grid-cols-4 gap-4 pt-3'>
          <div className='col-span-1 grid grid-flow-row grid-rows-3 gap-4'>
            <Card className='row-span-1 pt-3'>
              <CardContent>
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
              </CardContent>
            </Card>
            <Card className='row-span-2 pt-3'>
              <CardContent>
                <P className='text-sm font-semibold'>Видеоматериалы</P>
                <ScrollArea className='mt-5 h-[500px]'>
                  <div className='mt-2 grid grid-cols-2 justify-items-center gap-3 sm:md:grid-cols-1 xl:2xl:grid-cols-3'>
                    {Array.from({ length: 40 }).map((item, idx) => (
                      <div key={idx}>
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
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          {inventoryObjects && (
            <div className='col-span-3'>
              <InventoryObjectsTable
                inventoryCode={inventory.code as InventoryCode}
                inventoryObjects={inventoryObjects}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
