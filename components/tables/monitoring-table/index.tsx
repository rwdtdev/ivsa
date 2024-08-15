'use client';
import { DataTable } from '@/components/ui/data-table/data-table';
import { SystemEventsTableColumnNames } from '@/constants/mappings/tables-column-names';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
// import { fakeSystemEventItems } from './monitoringFakeData';
import { Action, ActionStatus, ActionType /* , UserRole */ } from '@prisma/client';
import {
  fetchSystemEventsTableColumns,
  filterableColumns,
  monitoringDatePickers
} from './columns';
import { JsonValue } from '@prisma/client/runtime/library';

// export type SystemEventObject = {
//   id: string;
//   actionAt: string;
//   actionType: ActionType;
//   name: string | null;
//   ip: string | null;
//   details: {
//     admin?: {
//       username: string;
//       department: string;
//     };
//     createdUser?: {
//       name: string;
//       username: string;
//     };
//     editedUser?: {
//       username: string;
//       name: string;
//       roleBefore?: UserRole;
//       roleAfter?: UserRole;
//     };
//     username?: string;
//     department?: string;
//     loginInput?: string;
//     videoFileName?: string;
//     subtitlesFileName?: string;
//     videoFileSize?: string;
//   };
// };

type Props = {
  monitoringData: {
    items: {
      id: string;
      requestId: string | null;
      actionAt: Date;
      type: ActionType;
      status: ActionStatus;
      initiator: string;
      ip: string | null;
      details: JsonValue | null;
    }[];
    pagination: {
      total?: number | undefined;
      pagesCount: number | undefined;
      currentPage?: number | undefined;
      perPage?: number | undefined;
      from?: number | undefined;
      to?: number | undefined;
      hasMore?: boolean | undefined;
    };
  };
};

export function MonitoringTable({ monitoringData }: Props) {
  const columns = React.useMemo<ColumnDef<Action, unknown>[]>(
    () => fetchSystemEventsTableColumns(),

    []
  );

  const { dataTable } = useDataTable({
    // data: items,
    // data: fakeSystemEventItems,
    data: monitoringData.items,
    columns,
    pageCount: monitoringData.pagination.pagesCount || 10,
    // pageCount: 50,
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
