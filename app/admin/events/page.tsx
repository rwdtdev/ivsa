import React from 'react';
import { SearchParams } from '@/types';

import BreadCrumb from '@/components/breadcrumb';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { EventType } from '@prisma/client';
import { getEventsAction } from '@/app/actions/server/events';
import { EventsTable } from '@/components/tables/events-table';

export interface IndexPageProps {
  searchParams: SearchParams;
}

const breadcrumbItems = [{ title: 'Пользователи', link: '/admin/users' }];

const MemoizedBreadCrumb = React.memo(BreadCrumb);
const MemoizedHeading = React.memo(Heading);

export default async function AuditEventsPage({ searchParams }: IndexPageProps) {
  const eventType =
    EventType[`${searchParams.type}`.toUpperCase() as keyof typeof EventType] ??
    EventType.AUDIT;

  let title = '';
  let description = '';

  if (eventType === EventType.AUDIT) {
    title = 'Архив инвентаризаций';
    description = 'Управление списком инвентаризаций';
  }

  if (eventType === EventType.BRIEFING) {
    title = 'Архив инструктажей';
    description = 'Управление списком иструктажей';
  }

  const events = await getEventsAction(searchParams, eventType);

  return (
    <div className='flex h-screen overflow-hidden'>
      <main className='w-full pt-16'>
        <div className='flex-1 space-y-4 p-4 pt-6 md:p-8'>
          <MemoizedBreadCrumb items={breadcrumbItems} />
          <div className='flex items-start justify-between'>
            <MemoizedHeading title={title} description={description} />
          </div>
          <Separator />
          <React.Suspense
            fallback={<DataTableSkeleton columnCount={4} filterableColumnCount={2} />}
          >
            <EventsTable events={events} />
          </React.Suspense>
        </div>
      </main>
    </div>
  );
}
