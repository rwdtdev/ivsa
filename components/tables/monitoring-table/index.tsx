'use client';
import { DataTable } from '@/components/ui/data-table/data-table';
import { SystemEventsTableColumnNames } from '@/constants/mappings/tables-column-names';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { fakeSystemEventItems } from './monitoringFakeData';
import { ActionType, UserRole } from '@prisma/client';
import {
  fetchSystemEventsTableColumns,
  filterableColumns,
  monitoringDatePickers
} from './columns';

export type SystemEventObject = {
  id: string;
  actionAt: string;
  actionType: ActionType;
  name: string | null;
  ip: string | null;
  details: {
    admin?: {
      username: string;
      department: string;
    };
    createdUser?: {
      name: string;
      username: string;
    };
    editedUser?: {
      username: string;
      name: string;
      roleBefore?: UserRole;
      roleAfter?: UserRole;
    };
    username?: string;
    department?: string;
    loginInput?: string;
    videoFileName?: string;
    subtitlesFileName?: string;
    videoFileSize?: string;
  };
};

export function MonitoringTable(/* { systemEvents }: Props */) {
  const columns = React.useMemo<ColumnDef<SystemEventObject, unknown>[]>(
    () => fetchSystemEventsTableColumns(),

    []
  );

  const { dataTable } = useDataTable({
    // data: items,
    data: fakeSystemEventItems,
    columns,
    // pageCount: pagination.pagesCount,
    pageCount: 50,
    filterableColumns: filterableColumns()
  });

  return (
    <DataTable
      dataTable={dataTable}
      columns={columns}
      columnNames={SystemEventsTableColumnNames}
      tableType='monitoringTable'
      withSearch
      datePickers={monitoringDatePickers}
      filterableColumns={filterableColumns()}
    />
  );
}
