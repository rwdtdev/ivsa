'use client';

import moment from 'moment';
import { getEventByIdAction } from '@/app/actions/server/events';
import BreadCrumb from '@/components/breadcrumb';
import { Heading } from '@/components/ui/heading';
import { getEntityId } from '@/lib/get-entity-id';
import { EventView } from '@/server/services/events/types';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { P } from '@/components/ui/typography/p';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRoles } from '@/constants/mappings/prisma-enums';
import { DATETIME_FORMAT, DATE_FORMAT } from '@/constants/date';
import { BriefingStatusBadge, EventStatusBadge } from '@/components/event-status-badge';
import { Separator } from '@/components/ui/separator';

import { CarouselSize } from '@/components/carousel';
import { ScrollArea } from '@/components/ui/scroll-area';
import Loading from '@/app/loading';
import { REGION_CODES, RegionCode } from '@/constants/mappings/region-codes';
import Link from 'next/link';
import { EnterIcon } from '@radix-ui/react-icons';
import { BriefingStatus } from '@prisma/client';

const breadcrumbItems = [
  {
    title: 'Реестр инвентаризаций',
    link: '/admin/events'
  },
  {
    title: 'Инвентаризация',
    link: ''
  }
];

export default function EventPage() {
  const [event, setEvent] = useState<EventView>();
  const pathname = usePathname();
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);

  const id = getEntityId(pathname);

  const fetchEventById = async (id: string) => {
    const result = await getEventByIdAction(id);
    if (result) {
      setEvent(result);
      setIsLoadingEvent(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEventById(id);
    }
  }, [id]);

  if (!event || isLoadingEvent) {
    return <Loading />;
  }

  return (
    <div className='flex-1 space-y-4 p-8'>
      <main className='w-full pt-16'>
        <BreadCrumb items={breadcrumbItems} />
        <div className='flex items-center justify-between'>
          <Heading title='Инвентаризация' description={`ID: ${id}`} />
        </div>
        <div className='grid h-full grid-cols-5 gap-4 pt-5'>
          <Card className='col-span-1'>
            <CardContent>
              <div className='my-4 space-y-4'>
                <div className='grid text-sm'>
                  <div className='flex'>
                    <P className='mr-2 font-semibold'>Статус:</P>
                    <EventStatusBadge status={event.status} />
                  </div>
                  <div className='mt-4 flex items-center'>
                    <P className='mr-2 font-semibold'>Инструктаж:</P>
                    <BriefingStatusBadge status={event.briefingStatus} />
                    {event.briefingRoomInviteLink &&
                      event.briefingStatus === BriefingStatus.IN_PROGRESS && (
                        <Link
                          className='ml-3 hover:text-blue-500 hover:underline'
                          href={event.briefingRoomInviteLink as string}
                          target='_blank'
                        >
                          <EnterIcon />
                        </Link>
                      )}
                  </div>
                  <P className='text-sm'>
                    <span className='font-semibold'>Дата начала:</span>{' '}
                    {moment(event.startAt).format(DATETIME_FORMAT)}
                  </P>
                  <P className='text-sm'>
                    <span className='font-semibold'>Дата начала:</span>{' '}
                    {moment(event.startAt).format(DATETIME_FORMAT)}
                  </P>
                  <P className='text-sm'>
                    <span className='font-semibold'>Дата окончания:</span>{' '}
                    {moment(event.endAt).format(DATETIME_FORMAT)}
                  </P>
                  <P className='text-sm'>
                    <span className='font-semibold'>Балансовая единица:</span>{' '}
                    {event.balanceUnit}
                  </P>
                  <P className='text-sm'>
                    <span className='font-semibold'>Код региона:</span>{' '}
                    {event.balanceUnitRegionCode},{' '}
                    {REGION_CODES[event.balanceUnitRegionCode as RegionCode]}
                  </P>
                  <P className='text-sm'>
                    <span className='font-semibold'>Приказ:</span> №{event.orderNumber} от{' '}
                    {moment(event.orderDate).format(DATE_FORMAT)}
                  </P>
                  <P className='text-sm'>
                    <span className='font-semibold'>Распоряжение:</span> №
                    {event.commandNumber} от{' '}
                    {moment(event.commandDate).format(DATE_FORMAT)}
                  </P>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className='col-span-1'>
            <CardHeader>
              <CardTitle>Участники</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea>
                <div className='space-y-4'>
                  <div className='grid gap-6'>
                    <div>
                      {event.participants &&
                        event.participants.map(
                          ({ name, tabelNumber, user, role }, idx) => {
                            const splited = name.split(' ');
                            const initials = [splited[0][0], splited[1][0]].join('');

                            return (
                              <div
                                key={idx}
                                className='mt-3 flex items-center justify-between space-x-4'
                              >
                                <div className='flex items-center space-x-4'>
                                  <Avatar>
                                    <AvatarFallback>{initials}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className='text-sm font-medium leading-none'>
                                      {name}{' '}
                                    </p>
                                    {!user && (
                                      <p className='text-xs text-red-500'>
                                        Пользователь не зарегистрирован
                                      </p>
                                    )}
                                    <p className='text-sm text-muted-foreground'>
                                      {UserRoles[role]}
                                    </p>
                                    <p className='text-sm text-muted-foreground'>
                                      Таб. номер: {tabelNumber}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          <Card className='col-span-3'>
            <CardHeader>
              <CardTitle>Описи</CardTitle>
            </CardHeader>
            <CardContent className='h-full'>
              <ScrollArea className='h-4/5'>
                <div className='space-y-4'>
                  {event.inventories &&
                    event.inventories.map((inventory, index) => {
                      return (
                        <div key={inventory.id}>
                          <div className='grid grid-cols-4 gap-1 space-x-5'>
                            <div className='mr-10 flex cursor-pointer items-center space-x-4'>
                              <div>
                                <p className='text-md font-medium leading-none'>
                                  Опись № {inventory.number} от{' '}
                                  {moment(inventory.date).format(DATE_FORMAT)}
                                </p>
                                <p className='text-sm text-muted-foreground'>
                                  ID: {inventory.id}
                                </p>
                              </div>
                            </div>
                            <CarouselSize />
                          </div>
                          {event.inventories &&
                          index === event.inventories.length - 1 ? null : (
                            <Separator />
                          )}
                        </div>
                      );
                    })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
