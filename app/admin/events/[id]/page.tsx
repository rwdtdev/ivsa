'use client';

import moment from 'moment';
import { getEventByIdAction } from '@/app/actions/server/events';
import BreadCrumb from '@/components/breadcrumb';
import { Heading } from '@/components/ui/heading';
import { getEntityId } from '@/lib/get-entity-id';
import { EventView } from '@/server/services/events/types';
import { EventType } from '@prisma/client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { P } from '@/components/ui/typography/p';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRoles } from '@/constants/mappings/prisma-enums';
import { DATETIME_FORMAT, DATE_FORMAT } from '@/constants/date';
import { EventStatusBadge } from '@/components/event-status-badge';
import { Separator } from '@/components/ui/separator';

import { CarouselSize } from '@/components/carousel';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function EventPage() {
  const [event, setEvent] = useState<EventView>();
  const pathname = usePathname();

  const id = getEntityId(pathname);

  const fetchEventById = async (id: string) => {
    const result = await getEventByIdAction(id);
    if (result) setEvent(result);
  };

  useEffect(() => {
    if (id) {
      fetchEventById(id);
    }
  }, []);

  const breadcrumbItems = [
    {
      title:
        event?.type === EventType.BRIEFING
          ? 'Реестр инструктажей'
          : 'Реестр инвентаризаций',
      link: `/admin/events?${event?.type.toLocaleLowerCase()}`
    },
    {
      title: event?.type === EventType.BRIEFING ? 'Инструктаж' : 'Инвентаризация',
      link: ''
    }
  ];

  return (
    <div className='flex-1 space-y-4 p-8'>
      <main className='w-full pt-16'>
        <BreadCrumb items={breadcrumbItems} />
        <div className='flex items-center justify-between'>
          <Heading
            title={event?.type === EventType.BRIEFING ? 'Инструктаж' : 'Инвентаризация'}
            description={`ID: ${id}`}
          />
        </div>
        <div className='grid h-full grid-cols-2 gap-4 pt-5'>
          <Card>
            <CardContent>
              <div className='my-4 space-y-4'>
                <div className='grid'>
                  <P className='text-sm'>
                    <span className='font-semibold'>Статус:</span>{' '}
                    <EventStatusBadge status={event?.status} />
                  </P>
                  <P className='text-sm'>
                    <span className='font-semibold'>Дата начала:</span>{' '}
                    {moment(event?.startAt).format(DATETIME_FORMAT)}
                  </P>
                  <P className='text-sm'>
                    <span className='font-semibold'>Дата окончания:</span>{' '}
                    {moment(event?.endAt).format(DATETIME_FORMAT)}
                  </P>
                  <P className='text-sm'>
                    <span className='font-semibold'>Балансовая единица:</span>{' '}
                    {event?.balanceUnit}
                  </P>
                  <P className='text-sm'>
                    <span className='font-semibold'>Код региона:</span>{' '}
                    {event?.balanceUnitRegionCode}
                  </P>
                  <P className='text-sm'>
                    <span className='font-semibold'>Приказ:</span> №{event?.orderNumber}{' '}
                    от {moment(event?.orderDate).format(DATE_FORMAT)}
                  </P>
                  <P className='text-sm'>
                    <span className='font-semibold'>Распоряжение:</span> №
                    {event?.commandNumber} от{' '}
                    {moment(event?.commandDate).format(DATE_FORMAT)}
                  </P>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Список участников</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea>
                <div className='space-y-4'>
                  <div className='grid gap-6'>
                    {event?.participants.map((participant) => {
                      const splited = participant.name.split(' ');
                      const initials = [splited[0][0], splited[1][0]].join('');

                      return (
                        <div
                          key={participant.id}
                          className='flex items-center justify-between space-x-4'
                        >
                          <div className='flex items-center space-x-4'>
                            <Avatar>
                              <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className='text-sm font-medium leading-none'>
                                {participant.name}
                              </p>
                              <p className='text-sm text-muted-foreground'>
                                {UserRoles[participant.role]}
                              </p>
                              <p className='text-sm text-muted-foreground'>
                                Таб. номер: {participant.tabelNumber}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Описи</CardTitle>
            </CardHeader>
            <CardContent className='h-full'>
              <ScrollArea className='h-4/5'>
                <div className='space-y-4'>
                  <div className='grid gap-6'>
                    {event?.inventories.map((inventory, index) => {
                      return (
                        <>
                          <div
                            key={inventory.id}
                            className='grid grid-cols-5 gap-1 space-x-5'
                          >
                            <div className='mr-10 flex items-center space-x-4'>
                              <div>
                                <p className='text-sm font-medium leading-none'>
                                  Опись № {inventory.number} от {inventory.date}
                                </p>
                                <p className='text-sm text-muted-foreground'>
                                  ID: {inventory.id}
                                </p>
                              </div>
                            </div>
                            <CarouselSize />
                          </div>
                          {index === event.inventories.length - 1 ? null : <Separator />}
                        </>
                      );
                    })}
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
