import Header from '@/components/layout/header';
import { MonitoringTable } from '@/components/tables/monitoring-table';
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton';
import React from 'react';
import { getMonitoringData } from '../actions/server/getMonitoringData';
import { SearchParams } from '@/types';

type MonitoringPageProps = {
  searchParams: SearchParams;
};
export const metadata = {
  title: 'Журнал событий'
};

export default async function MonitoringPage({ searchParams }: MonitoringPageProps) {
  const monitoringData = await getMonitoringData(searchParams);

  return (
    <div className='flex h-screen flex-col'>
      <Header title={'Журнал событий'} />
      <div className='flex h-full flex-col overflow-hidden px-3 py-3 sm:px-8'>
        <React.Suspense
          fallback={<DataTableSkeleton columnCount={4} filterableColumnCount={2} />}
        >
          <MonitoringTable
            // systemEvents={systemEvents}
            monitoringData={monitoringData}
          />
        </React.Suspense>
      </div>
    </div>
  );
}
