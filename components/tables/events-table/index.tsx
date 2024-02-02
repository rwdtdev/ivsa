'use client';

import { eventsDatePickers, fetchEventsTableColumnDefs } from './columns';
import React from 'react';
import { useDataTable } from '@/hooks/use-data-table';
import { PaginatedResponse } from '@/server/types';
import { DataTable } from '@/components/data-table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Event } from '@prisma/client';
import { EventView } from '@/server/services/events/types';
import { DataTableFloatingBar } from '@/components/data-table/data-table-floating-bar';

interface EventsTableProps {
  events:
    | PaginatedResponse<EventView>
    | { items: []; pagination: { pagesCount: number } };
}

export function EventsTable({ events }: EventsTableProps) {
  const { items, pagination } = events;

  const [isPending, startTransition] = React.useTransition();

  const columns = React.useMemo<ColumnDef<EventView, unknown>[]>(
    () => fetchEventsTableColumnDefs(isPending, startTransition),
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
      datePickers={eventsDatePickers}
      // filterableColumns={[]}
      // floatingBarContent={DataTableFloatingBar({
      //   table: dataTable
      // })}
      // deleteRowsAction={(event) => deleteSelectedRows(dataTable, event)}
    />
  );
}
