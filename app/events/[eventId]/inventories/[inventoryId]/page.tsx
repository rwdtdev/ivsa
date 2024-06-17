import { getInventoryByIdAction } from '@/app/actions/server/inventories';
import {
  getInventoryObjectsByInventoryIdAction
} from '@/app/actions/server/inventoryObjects';
import BreadCrumb from '@/components/breadcrumb';
import Header from '@/components/layout/header';
import { InventoryObjectsTable } from '@/components/tables/inventory-objects-table';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { P } from '@/components/ui/typography/p';
import { DATE_FORMAT } from '@/constants/date';
import { InventoryCode } from '@/core/inventory/types';
import { SearchParams } from '@/types';
import { Download, PlayCircle } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';

export const metadata = {
  title: 'Опись инвентаризации'
};

export interface IndexPageProps {
  searchParams: SearchParams;
}

export default async function InventoryPage({
  params: { eventId, inventoryId }
}: {
  params: {
    eventId: string;
    inventoryId: string;
  };
}) {

  console.log({ inventoryId, eventId });
  const inventory = await getInventoryByIdAction(inventoryId, eventId);
  console.log({ inventoryId, eventId, inventory });
  if (!inventory) return <div>null</div>;

  const inventoryObjects = await getInventoryObjectsByInventoryIdAction(inventory.id, {});

  const breadcrumbItems = [
    {
      title: 'Реестр инвентаризаций',
      link: '/events'
    },
    {
      title: 'Инвентаризация',
      link: `/events/${eventId}`
    },
    {
      title: `Инвентаризационная опись ${inventory.shortName}`,
      link: ''
    }
  ];

  return (
    <div className='flex h-screen flex-col '>
      <Header title={'Инвентаризационная опись'} />
      {/* <div className='flex-1 space-y-4 p-8'> */}
      <main className=' flex grow flex-col overflow-hidden px-8'>
        <BreadCrumb items={breadcrumbItems} />

        <Tabs defaultValue='infoTab' className='flex grow flex-col overflow-hidden '>
          <TabsList className='grid w-full grid-cols-3 '>
            <TabsTrigger value='infoTab'>Информация</TabsTrigger>
            <TabsTrigger value='inventoryTab'>Опись</TabsTrigger>
            <TabsTrigger value='videoTab'>Видеоматериалы</TabsTrigger>
          </TabsList>
          <TabsContent value='infoTab'>
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
          </TabsContent>
          <TabsContent
            value='inventoryTab'
            className='flex grow flex-col overflow-hidden '
          >
            <div className='flex grow flex-col overflow-hidden '>
              {inventoryObjects && (
                <InventoryObjectsTable
                  inventoryCode={inventory.code as InventoryCode}
                  inventoryObjects={inventoryObjects}
                />
              )}
            </div>
          </TabsContent>
          <TabsContent value='videoTab' className='flex flex-col overflow-hidden '>
            {/* <Card className='row-span-2 h-full overflow-hidden pt-3'>
              <CardContent className='flex h-full flex-col overflow-hidden'> */}
            {/* <P className='text-sm font-semibold'>Видеоматериалы</P> */}
            <div className='mt-2 grid grid-cols-2 justify-items-center gap-3 overflow-hidden md:grid-cols-3 xl:grid-cols-4'>
              <ScrollArea className='mt-5 '>
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
                            src={`/api/s3video/${inventory.eventId}/${inventory.id}/${idx}`}
                            width='100%'
                            itemType='video/mp4'
                            autoPlay
                            controls
                          >
                            <track
                              default
                              src={`/api/s3subtitles/${inventory.eventId}/${inventory.id}/${idx}`}
                            />
                          </video>
                        </DialogHeader>
                        <a
                          href={`/api/s3video/${inventory.eventId}/${inventory.id}/${idx}`}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-sm'
                          download
                        >
                          скачать видео
                          <Download size={16} className='display: ml-2 inline ' />
                        </a>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </ScrollArea>
            </div>
            {/* </CardContent>
            </Card> */}
          </TabsContent>
        </Tabs>
      </main>
      {/* </div> */}
    </div>
  );
}
