import React, { use } from 'react';
import Link from 'next/link';
import { SearchParams } from '@/types';
import { Plus } from 'lucide-react';
import { getUsersAction } from '@/app/actions/server/users';

import BreadCrumb from '@/components/breadcrumb';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { UsersTable } from '@/components/tables/users-table';

export interface IndexPageProps {
  searchParams: SearchParams;
}

const breadcrumbItems = [{ title: 'Пользователи', link: '/admin/users' }];

const MemoizedBreadCrumb = React.memo(BreadCrumb);
const MemoizedHeading = React.memo(Heading);

export default async function UsersPage({ searchParams }: IndexPageProps) {
  const users = await getUsersAction(searchParams);

  return (
    <div className='flex h-screen overflow-hidden'>
      <main className='w-full pt-16'>
        <div className='flex-1 space-y-4 p-4 pt-6 md:p-8'>
          <MemoizedBreadCrumb items={breadcrumbItems} />
          <div className='flex items-start justify-between'>
            <MemoizedHeading
              title='Пользователи'
              description='Управление пользователями'
            />
            <Button asChild>
              <Link href='/admin/users/new' className='text-xs md:text-sm'>
                <Plus className='mr-2 h-4 w-4' /> Добавить
              </Link>
            </Button>
          </div>
          <Separator />
          <React.Suspense
            fallback={<DataTableSkeleton columnCount={4} filterableColumnCount={2} />}
          >
            <UsersTable users={users} />
          </React.Suspense>
        </div>
      </main>
    </div>
  );
}
