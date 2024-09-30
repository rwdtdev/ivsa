'use client';

import moment from 'moment';
import { getEventByIdAction } from '@/app/actions/server/events';
import BreadCrumb from '@/components/breadcrumb';
import { getEntityId } from '@/lib/get-entity-id';
import { EventView } from '@/core/event/types';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { P } from '@/components/ui/typography/p';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DATE_FORMAT } from '@/constants/date';
import { BriefingStatusBadge, EventStatusBadge, InventoryStatusBadge } from '@/components/event-status-badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Loading from '@/app/loading';
import { REGION_CODES, RegionCode } from '@/constants/mappings/region-codes';
import Link from 'next/link';
import { EnterIcon } from '@radix-ui/react-icons';
import { BriefingStatus, UserStatus } from '@prisma/client';
import { UserRoundXIcon } from 'lucide-react';
import Header from '@/components/layout/header';
import { ParticipantRoles } from '@/constants/mappings/prisma-enums';

const breadcrumbItems = [
  {
    title: 'Реестр инвентаризаций',
    link: '/'
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
    document.title = 'Инвентаризация';
  }, [id]);

  if (!event || isLoadingEvent) {
    return <Loading />;
  }

  return (
    <>
      <Header title={'Инвентаризация'} />
      <main className='w-full px-3 pb-8 sm:px-8'>
        <BreadCrumb items={breadcrumbItems} />
        <div className='grid h-full grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-4'>
          <Card>
            <CardContent>
              <div className='my-4'>
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
                    {moment(event.startAt).format(DATE_FORMAT)}
                  </P>
                  <P className='text-sm'>
                    <span className='font-semibold'>Дата окончания:</span>{' '}
                    {moment(event.endAt).format(DATE_FORMAT)}
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
          <Card>
            <CardHeader>
              <CardTitle>Участники</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea>
                <div className='space-y-4'>
                  <div className='grid gap-6'>
                    <div>
                      {event.participants &&
                        event.participants.map(({ tabelNumber, user, role }, idx) => {
                          let initials;

                          if (user) {
                            const splited = user.name.split(' ');

                            if (splited.length > 1) {
                              initials = [splited[0][0], splited[1][0]]
                                .join('')
                                .toUpperCase();
                            } else if (splited.length === 1) {
                              initials = [splited[0][0], splited[0][1]]
                                .join('')
                                .toUpperCase();
                            }
                          } else {
                            initials = <UserRoundXIcon />;
                          }

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
                                    {(user && user.name) || tabelNumber}{' '}
                                  </p>
                                  {user && user.status === UserStatus.BLOCKED && (
                                    <p className='text-sm text-red-500'>Заблокирован</p>
                                  )}
                                  <p className='text-sm text-muted-foreground'>
                                    {ParticipantRoles[role]}
                                  </p>
                                  {user && (
                                    <p className='text-sm text-muted-foreground'>
                                      Таб. номер: {tabelNumber}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          <Card className='2xl:col-span-2'>
            <CardHeader>
              <CardTitle>Описи</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='border-t-[1px]'>
                {event.inventories &&
                  event.inventories
                    .filter((inventory) => !inventory.parentId)
                    .map((inventory) => {
                      return (
                        <li key={inventory.id} className='border-b-[1px]'>
                          <Link
                            href={`/events/${inventory.eventId}/inventories/${inventory.id}`}
                            className='block px-2 text-sm leading-10 hover:bg-slate-100 flex items-center gap-2'
                          >
                            Комплексная опись № {inventory.number} от{' '}
                            {moment(inventory.date).format(DATE_FORMAT)}
                            <InventoryStatusBadge status={inventory.status} removedOnly />
                          </Link>
                        </li>
                      );
                    })}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
