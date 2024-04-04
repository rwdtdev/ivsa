'use client';

import moment from 'moment';
import { getEventByIdAction } from '@/app/actions/server/events';
import BreadCrumb from '@/components/breadcrumb';
import { Heading } from '@/components/ui/heading';
import { getEntityId } from '@/lib/get-entity-id';
import { EventView } from '@/core/event/types';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { P } from '@/components/ui/typography/p';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRoles } from '@/constants/mappings/prisma-enums';
import { DATETIME_FORMAT, DATE_FORMAT } from '@/constants/date';
import { BriefingStatusBadge, EventStatusBadge } from '@/components/event-status-badge';

import { ScrollArea } from '@/components/ui/scroll-area';
import Loading from '@/app/loading';
import { REGION_CODES, RegionCode } from '@/constants/mappings/region-codes';
import Link from 'next/link';
import { EnterIcon } from '@radix-ui/react-icons';
import { BriefingStatus, UserStatus } from '@prisma/client';
import { UserRoundXIcon } from 'lucide-react';
import { InventoryCodes } from '@/core/inventory/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { CarouselSize } from '@/components/carousel';

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
                                    <p className='text-sm text-red-500 '>Заблокирован</p>
                                  )}
                                  {user && user.status === UserStatus.RECUSED && (
                                    <p className='text-sm text-orange-500'>
                                      Отстранен от должности
                                    </p>
                                  )}
                                  <p className='text-sm text-muted-foreground'>
                                    {UserRoles[role]}
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
          <Card className='col-span-3 h-full'>
            <CardHeader>
              <CardTitle>Описи</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className='h-4/5'>
                <Accordion type='multiple'>
                  {event.inventories &&
                    event.inventories
                      .filter((inventory) => !inventory.parentId)
                      .map((inventory) => {
                        return (
                          <AccordionItem value={inventory.id} key={inventory.id}>
                            <AccordionTrigger className='hover:no-underline'>
                              <div className='flex flex-col'>
                                <div className='flex justify-start'>
                                  <Link
                                    href={`/admin/inventories/${inventory.id}`}
                                    className='text-sm hover:underline'
                                  >
                                    Комплексная опись № {inventory.number} от{' '}
                                    {moment(inventory.date).format(DATE_FORMAT)}
                                  </Link>
                                </div>
                                <div className='flex justify-start'>
                                  <p className='text-xs text-muted-foreground'>
                                    {
                                      InventoryCodes[
                                        inventory.code as keyof typeof InventoryCodes
                                      ].shortName
                                    }
                                  </p>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <CarouselSize />
                              <Table key={inventory.id}>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className='w-[60px]'>№</TableHead>
                                    <TableHead className='w-[300px]'>Форма</TableHead>
                                    <TableHead>Код формы</TableHead>
                                    <TableHead>Дата</TableHead>
                                    <TableHead>Номер</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {event.inventories
                                    .filter(({ parentId }) => parentId === inventory.id)
                                    .map((child, index) => (
                                      <TableRow key={child.id}>
                                        <TableCell>
                                          <Link
                                            href={`/admin/inventories/${child.id}`}
                                            className='flex text-muted-foreground'
                                          >
                                            {index + 1}
                                          </Link>
                                        </TableCell>
                                        <TableCell>
                                          <Link
                                            href={`/admin/inventories/${child.id}`}
                                            className='flex'
                                          >
                                            {
                                              InventoryCodes[
                                                child.code as keyof typeof InventoryCodes
                                              ].shortName
                                            }
                                          </Link>
                                        </TableCell>
                                        <TableCell>
                                          <Link
                                            href={`/admin/inventories/${child.id}`}
                                            className='flex'
                                          >
                                            {child.code}
                                          </Link>
                                        </TableCell>
                                        <TableCell>
                                          <Link
                                            href={`/admin/inventories/${child.id}`}
                                            className='flex'
                                          >
                                            {moment(child.date).format(DATE_FORMAT)}
                                          </Link>
                                        </TableCell>
                                        <TableCell>
                                          <Link
                                            href={`/admin/inventories/${child.id}`}
                                            className='flex'
                                          >
                                            {child.number}
                                          </Link>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                </TableBody>
                              </Table>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                </Accordion>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
