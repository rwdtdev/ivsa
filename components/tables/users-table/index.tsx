'use client';

import { DataTable } from '@/components/ui/data-table';
import { fetchUsersTableColumnDefs } from './columns';
import { UserTableView } from '@/types/composition';
import React from 'react';
import { useDataTable } from '@/hooks/use-data-table';

interface UsersTableProps {
  usersPromise: any;
}

export function UsersTable({ usersPromise }: UsersTableProps) {
  const { data, pageCount } = React.use(usersPromise);

  const [isPending, startTransition] = React.useTransition();

  const columns = React.useMemo<ColumnDef<UserTableView, unknown>[]>(
    () => fetchUsersTableColumnDefs(isPending, startTransition),
    [isPending]
  );

  const { dataTable } = useDataTable({
    data,
    columns,
    pageCount
    // searchableColumns,
    // filterableColumns
  });

  return (
    <DataTable
      dataTable={dataTable}
      columns={columns}
      searchableColumns={searchableColumns}
      filterableColumns={filterableColumns}
      floatingBarContent={TasksTableFloatingBarContent(dataTable)}
      deleteRowsAction={(event) => deleteSelectedRows(dataTable, event)}
    />
  );
}
