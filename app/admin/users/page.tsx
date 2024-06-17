import React from 'react';
import Link from 'next/link';
import { SearchParams } from '@/types';
import { Plus } from 'lucide-react';
import { getUsersAction } from '@/app/actions/server/users';

import BreadCrumb from '@/components/breadcrumb';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton';
import { UsersTable } from '@/components/tables/users-table';
import { getDepartmentsAction } from '@/app/actions/server/departments';
import { getOrganisationsAction } from '@/app/actions/server/organisations';
import Header from '@/components/layout/header';

export const metadata = {
  title: 'Пользователи'
};

export interface IndexPageProps {
  searchParams: SearchParams;
}

const breadcrumbItems = [{ title: 'Пользователи', link: '/admin/users' }];

const MemoizedBreadCrumb = React.memo(BreadCrumb);
const MemoizedHeading = React.memo(Heading);

export default async function UsersPage({ searchParams }: IndexPageProps) {
  const users = await getUsersAction(searchParams);
  const departments = await getDepartmentsAction();
  const organisations = await getOrganisationsAction();

  return (
    <div className='flex h-screen flex-col'>
      <Header title='Пользователи' />
      <div className='flex h-full flex-col overflow-hidden px-8 py-3'>
        <React.Suspense
          fallback={<DataTableSkeleton columnCount={4} filterableColumnCount={2} />}
        >
          <UsersTable
            users={users}
            departments={departments}
            organisations={organisations}
          />
        </React.Suspense>
      </div>
    </div>
  );
}
