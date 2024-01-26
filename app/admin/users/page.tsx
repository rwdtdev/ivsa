'use client';

import BreadCrumb from '@/components/breadcrumb';

// import { UsersTable } from '@/components/tables/user-tables/table';
import { DataTable } from '@/components/data-table/data-table';
import React, { useContext } from 'react';
import { DataContext } from '@/providers/DataProvider';
import {
  fetchUsersTableColumnDefs,
  searchableColumns
} from '@/components/tables/users-table/columns';
import { ColumnDef } from '@tanstack/react-table';
import { useDataTable } from '@/hooks/use-data-table';
import { UserTableView } from '@/types/composition';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

const breadcrumbItems = [{ title: 'Пользователи', link: '/admin/users' }];

export default function page() {
  const { users, departments, organisations } = useContext(DataContext);
  const router = useRouter();

  const formattedUsers: UserTableView[] = users.items.map(
    ({ organisationId, departmentId, ...user }) => {
      const department = departments.find(({ id }) => id === departmentId);
      const organisation = organisations.find(({ id }) => id === organisationId);

      return {
        ...user,
        departmentName: department?.name,
        organisationName: organisation?.name
      };
    }
  );

  // Learn more about React.use here: https://react.dev/reference/react/use
  const [isPending, startTransition] = React.useTransition();

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo<ColumnDef<UserTableView, unknown>[]>(
    () => fetchUsersTableColumnDefs(isPending, startTransition),
    [isPending]
  );

  const { dataTable } = useDataTable({
    data: formattedUsers,
    columns,
    pageCount: users.pagination.pagesCount,
    searchableColumns
    // filterableColumns
  });

  return (
    <div className='flex-1 space-y-4 p-4 pt-6 md:p-8'>
      <BreadCrumb items={breadcrumbItems} />
      {/* <UsersTable data={formattedUsers} /> */}

      {/* <React.Suspense
          fallback={<DataTable columnCount={4} filterableColumnCount={2} />}
        > */}
      <div className='flex items-start justify-between'>
        <Heading
          title={`Пользователи (${formattedUsers.length})`}
          description='Управление пользователями'
        />
        <Button
          className='text-xs md:text-sm'
          onClick={() => router.push(`/admin/users/new`)}
        >
          <Plus className='mr-2 h-4 w-4' /> Добавить
        </Button>
      </div>
      <Separator />
      <DataTable
        dataTable={dataTable}
        columns={columns}
        searchableColumns={searchableColumns}
        // filterableColumns={filterableColumns}
        // floatingBarContent={TasksTableFloatingBarContent(dataTable)}
        // deleteRowsAction={(event) => deleteSelectedRows(dataTable, event)}
      />
      {/* </React.Suspense> */}
    </div>
  );
}
