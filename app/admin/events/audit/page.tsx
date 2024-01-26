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
import { Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';

const breadcrumbItems = [
  { title: 'Архив видеоинвентаризаций', link: '/admin/events/audit' }
];

export default function AuditEventsPage() {
  const { users } = useContext(DataContext);

  // Learn more about React.use here: https://react.dev/reference/react/use
  const [isPending, startTransition] = React.useTransition();

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo<ColumnDef<UserTableView, unknown>[]>(
    () => fetchUsersTableColumnDefs(isPending, startTransition),
    [isPending]
  );

  const { dataTable } = useDataTable({
    data: users,
    columns,
    pageCount: users.length,
    searchableColumns
    // filterableColumns
  });

  return (
    <div className='flex-1 space-y-4 p-4 pt-6 md:p-8'>
      <BreadCrumb items={breadcrumbItems} />
      {/* <UsersTable data={formattedUsers} /> */}

      <div className='flex items-start justify-between'>
        <Heading
          title={`Архив видеоинвентаризаций (${users.length})`}
          description='Управление архивом видеоинвентаризаций'
        />
        <Button className='text-xs md:text-sm' onClick={() => {}}>
          <Plus className='mr-2 h-4 w-4' /> Добавить
        </Button>
      </div>
      <Separator />

      <React.Suspense
        fallback={<DataTableSkeleton columnCount={4} filterableColumnCount={2} />}
      >
        <DataTable
          dataTable={dataTable}
          columns={columns}
          searchableColumns={searchableColumns}
          // filterableColumns={filterableColumns}
          // floatingBarContent={TasksTableFloatingBarContent(dataTable)}
          // deleteRowsAction={(event) => deleteSelectedRows(dataTable, event)}
        />
      </React.Suspense>
    </div>
  );
}
