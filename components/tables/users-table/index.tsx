'use client';

import { fetchUsersTableColumnDefs, filterableColumns } from './columns';
import React from 'react';
import { useDataTable } from '@/hooks/use-data-table';
import { PaginatedResponse } from '@/server/types';
import { UserView } from '@/types/user';
import { DataTable } from '@/components/data-table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Department, Organisation } from '@prisma/client';

interface UsersTableProps {
  users: PaginatedResponse<UserView> | { items: []; pagination: { pagesCount: number } };
  departments: Department[];
  organisations: Organisation[];
}

export function UsersTable({ users, departments, organisations }: UsersTableProps) {
  const { items, pagination } = users;

  const [isPending, startTransition] = React.useTransition();

  const columns = React.useMemo<ColumnDef<UserView, unknown>[]>(
    () => fetchUsersTableColumnDefs(isPending, startTransition),
    [isPending]
  );

  const { dataTable } = useDataTable({
    data: items,
    columns,
    pageCount: pagination.pagesCount,
    // searchableColumns: searchableColumns
    filterableColumns: filterableColumns(departments, organisations)
  });

  return (
    <DataTable
      dataTable={dataTable}
      columns={columns}
      withSearch
      filterableColumns={filterableColumns(departments, organisations)}
      // floatingBarContent={TasksTableFloatingBarContent(dataTable)}
      // deleteRowsAction={(event) => deleteSelectedRows(dataTable, event)}
    />
  );
}
