'use client';

import { eventsDatePickers, fetchEventsTableColumnDefs } from './columns';
import React from 'react';
import { useDataTable } from '@/hooks/use-data-table';
import { PaginatedResponse } from '@/server/types';
import { DataTable } from '@/components/data-table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { EventView } from '@/server/services/events/types';
import { EventsTableColumnNames } from '@/constants/mappings/tables-column-names';

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
  });

  return (
    <DataTable
      dataTable={dataTable}
      columns={columns}
      datePickers={eventsDatePickers}
      columnNames={EventsTableColumnNames}
    />
  );
}
