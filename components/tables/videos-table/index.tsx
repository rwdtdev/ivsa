'use client';

import { fetchVideosTableColumnDefs } from './columns';
import React from 'react';
import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/ui/data-table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { EventsTableColumnNames } from '@/constants/mappings/tables-column-names';
import { VideoResourcesTest } from '@/app/events/[eventId]/inventories/[inventoryId]/videoslist/page';

interface Props {
  // resources: InventoryResource[];
  resources: VideoResourcesTest[];
}

export function VideosTable({ resources }: Props) {
  // const columns = React.useMemo<ColumnDef<InventoryResource, unknown>[]>(
  const columns = React.useMemo<ColumnDef<VideoResourcesTest, unknown>[]>(
    () => fetchVideosTableColumnDefs(),
    []
  );

  const { dataTable } = useDataTable({
    data: resources,
    columns,
    pageCount: 1
    // filterableColumns: filterableColumns()
  });

  return (
    <DataTable
      dataTable={dataTable}
      columns={columns}
      // / @ts-expect-error neex fix types
      // datePickers={eventsDatePickers}
      columnNames={EventsTableColumnNames}
      // filterableColumns={filterableColumns()}
      // isEventsTable={true}
    />
  );
}
