import React from 'react';
import { SearchParams } from '@/types';
import { getUsersAction } from '@/app/actions/server/users';
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton';
import { UsersTable } from '@/components/tables/users-table';
import Header from '@/components/layout/header';

export const metadata = {
  title: 'Пользователи'
};

export interface IndexPageProps {
  searchParams: SearchParams;
}

export default async function UsersPage({ searchParams }: IndexPageProps) {
  const users = await getUsersAction(searchParams);

  return (
    <div className='flex h-screen flex-col'>
      <Header title='Пользователи' />
      <div className='flex h-full flex-col overflow-hidden px-8 py-3'>
        <React.Suspense
          fallback={<DataTableSkeleton columnCount={4} filterableColumnCount={2} />}
        >
          <UsersTable users={users} />
        </React.Suspense>
      </div>
    </div>
  );
}
