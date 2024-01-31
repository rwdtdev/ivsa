'use client';

import { fetchUsersTableColumnDefs } from './columns';
import React from 'react';
import { useDataTable } from '@/hooks/use-data-table';
import { PaginatedResponse } from '@/server/types';
import { UserView } from '@/types/user';
import { DataTable } from '@/components/data-table/data-table';
import { ColumnDef } from '@tanstack/react-table';

interface UsersTableProps {
  users: PaginatedResponse<UserView> | { items: []; pagination: { pagesCount: number } };
}

export function UsersTable({ users }: UsersTableProps) {
  const { items, pagination } = users;

  const [isPending, startTransition] = React.useTransition();

  const columns = React.useMemo<ColumnDef<UserView, unknown>[]>(
    () => fetchUsersTableColumnDefs(isPending, startTransition),
    [isPending]
  );

  const { dataTable } = useDataTable({
    data: items,
    columns,
    pageCount: pagination.pagesCount
    // searchableColumns: searchableColumns
    // filterableColumns: []
  });

  return (
    <DataTable
      dataTable={dataTable}
      columns={columns}
      // filterableColumns={[]}
      // floatingBarContent={TasksTableFloatingBarContent(dataTable)}
      // deleteRowsAction={(event) => deleteSelectedRows(dataTable, event)}
    />
  );
}
