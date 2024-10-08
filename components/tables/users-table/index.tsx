'use client';

import { fetchUsersTableColumnDefs, filterableColumns } from './columns';
import React from 'react';
import { useDataTable } from '@/hooks/use-data-table';
import { PaginatedResponse } from '@/types';
import { UserView } from '@/types/user';
import { DataTable } from '@/components/ui/data-table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { UsersTableColumnNames } from '@/constants/mappings/tables-column-names';
import { useSession } from 'next-auth/react';

interface UsersTableProps {
  users: PaginatedResponse<UserView> | { items: []; pagination: { pagesCount: number } };
}

export function UsersTable({ users }: UsersTableProps) {
  const { items, pagination } = users;
  const session = useSession();
  // console.log('🚀 ~ UsersTable ~ session:', session);
  const userRole = session.data?.user.role;
  const columns = React.useMemo<ColumnDef<UserView, unknown>[]>(
    () => fetchUsersTableColumnDefs(userRole),
    []
  );

  const { dataTable } = useDataTable({
    data: items,
    columns,
    pageCount: pagination.pagesCount,
    // searchableColumns: searchableColumns
    filterableColumns: filterableColumns()
  });

  return (
    <DataTable
      dataTable={dataTable}
      columns={columns}
      withSearch
      withSelectedRows
      columnNames={UsersTableColumnNames}
      filterableColumns={filterableColumns()}
      // floatingBarContent={TasksTableFloatingBarContent(dataTable)}
      // deleteRowsAction={(event) => deleteSelectedRows(dataTable, event)}
      // deleteRowsAction={(event) => console.log('deleteRowsAction', dataTable, event)}
      tableType='usersTable'
    />
  );
}
