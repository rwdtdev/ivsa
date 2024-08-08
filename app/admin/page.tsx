import Header from '@/components/layout/header';
import { SystemEventsTable } from '@/components/tables/system-events-table';
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton';
import React from 'react';

export default async function page() {
  return (
    // <>
    //   <Header title='Журнал событий' />
    //   <div className='flex h-screen overflow-hidden'>
    //     <main className='w-full p-16'></main>
    //   </div>
    // </>
    <div className='flex h-screen flex-col'>
      <Header title={'Журнал событий'} />
      <div className='flex h-full flex-col overflow-hidden px-3 py-3 sm:px-8'>
        <React.Suspense
          fallback={<DataTableSkeleton columnCount={4} filterableColumnCount={2} />}
        >
          <SystemEventsTable
          // events={events}
          />
        </React.Suspense>
      </div>
    </div>
  );
}
