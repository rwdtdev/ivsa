'use client';

import { getInventoryByIdAction } from '@/app/actions/server/inventories';
import Loading from '@/app/loading';
import BreadCrumb from '@/components/breadcrumb';
// import { CarouselSize } from '@/components/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { P } from '@/components/ui/typography/p';
import { DATE_FORMAT } from '@/constants/date';
import { getEntityId } from '@/lib/get-entity-id';
import { Inventory } from '@prisma/client';
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
  const [inventory, setInventory] = useState<Inventory>();
  const pathname = usePathname();
  const [isLoadingInventory, setIsLoadingInventory] = useState(true);

  const id = getEntityId(pathname);

  const fetchEventById = async (id: string) => {
    // TODO add event ids!!!!
    // @ts-expect-error need add eventId second param
    const result = await getInventoryByIdAction(id);
    if (result) {
      setInventory(result);
      setIsLoadingInventory(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEventById(id);
    }
  }, []);

  console.log(inventory);

  if (!inventory || isLoadingInventory) {
    return <Loading />;
  }

  return (
    <div className='flex-1 space-y-4 p-8'>
      <main className='w-full pt-16'>
        <BreadCrumb items={breadcrumbItems} />
        <div className='flex items-center justify-between'>
          <Heading title='Инвентаризационная опись' description={`ID: ${id}`} />
        </div>
        <div className='grid h-full grid-flow-row-dense grid-cols-2 grid-rows-2 gap-4 pt-5'>
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
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              {/* {Object.keys(inventory.attributes).map((key: string, idx: number) => (
                <P className='text-sm' key={idx}>
                  <span className='font-semibold'>{key}:</span>{' '}
                  {inventory.attributes[key as keyof typeof inventory.attributes]}
                </P>
              ))} */}
            </CardContent>
          </Card>
          <Card className='col-span-2 pl-20'>
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
            {/* <CarouselSize /> */}
          </Card>
        </div>
      </main>
    </div>
  );
}
