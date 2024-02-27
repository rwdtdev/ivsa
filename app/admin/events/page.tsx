import React from 'react';
import { SearchParams } from '@/types';

import BreadCrumb from '@/components/breadcrumb';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton';
import { getEventsAction } from '@/app/actions/server/events';
import { EventsTable } from '@/components/tables/events-table';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface IndexPageProps {
  searchParams: SearchParams;
}

const MemoizedBreadCrumb = React.memo(BreadCrumb);
const MemoizedHeading = React.memo(Heading);

export default async function AuditEventsPage({ searchParams }: IndexPageProps) {
  const breadcrumbItems = [
    {
      title: 'Реестр инвентаризаций',
      link: `/admin/events`
    }
  ];

  const events = await getEventsAction(searchParams);

  return (
    <div className='flex h-screen overflow-hidden'>
      <main className='w-full pt-16'>
        <div className='flex-1 space-y-4 p-4 pt-6 md:p-8'>
          <MemoizedBreadCrumb items={breadcrumbItems} />
          <div className='flex items-start justify-between'>
            <MemoizedHeading
              title='Реестр инвентаризаций'
              description='Управление реестром инвентаризаций'
            />
          </div>
          <Separator />
          <React.Suspense
            fallback={<DataTableSkeleton columnCount={4} filterableColumnCount={2} />}
          >
            <ScrollArea className='h-[60vh]'>
              <EventsTable events={events} />
            </ScrollArea>
          </React.Suspense>
        </div>
      </main>
    </div>
  );
}
