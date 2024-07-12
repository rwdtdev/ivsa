import React from 'react';
import { SearchParams } from '@/types';
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton';
import { getEventsAction } from '@/app/actions/server/events';
import { EventsTable } from '@/components/tables/events-table';
import Header from '@/components/layout/header';

export const metadata = {
  title: 'Инвентаризации'
};

export interface IndexPageProps {
  searchParams: SearchParams;
}

export default async function EventsPage({ searchParams }: IndexPageProps) {
  const events = await getEventsAction(searchParams);

  return (
    <div className='flex h-screen flex-col'>
      <Header title={'Реестр инвентаризаций'} />
      <div className='flex h-full flex-col overflow-hidden px-3 py-3 sm:px-8'>
        <React.Suspense
          fallback={<DataTableSkeleton columnCount={4} filterableColumnCount={2} />}
        >
          <EventsTable events={events} />
        </React.Suspense>
      </div>
    </div>
  );
}
