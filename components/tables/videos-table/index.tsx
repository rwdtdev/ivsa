'use client';

import { fetchVideosTableColumnDefs } from './columns';
import React from 'react';
import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/ui/data-table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { EventsTableColumnNames } from '@/constants/mappings/tables-column-names';
import { InventoryResourceWithAddress } from '@/app/actions/server/inventories';
import { Inventory } from '@prisma/client';

type Props = {
  inventoryWithRecourses: Inventory & { resources: InventoryResourceWithAddress[] };
  isUserChairman: boolean;
};

export function VideosTable({ inventoryWithRecourses, isUserChairman }: Props) {
  const columns = React.useMemo<ColumnDef<InventoryResourceWithAddress, unknown>[]>(
    () => fetchVideosTableColumnDefs(inventoryWithRecourses.number, isUserChairman),
    []
  );

  const { dataTable } = useDataTable({
    data: inventoryWithRecourses.resources,
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
