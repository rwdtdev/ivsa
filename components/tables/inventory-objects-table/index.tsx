'use client';

import { fetchInventoryObjectsTableColumnDefs } from './columns';
import React from 'react';
import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/ui/data-table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { InventoryObjectsTableColumnNames } from '@/constants/mappings/tables-column-names';
import { InventoryObject } from '@prisma/client';
import { PaginatedInventoryObject } from '@/app/actions/server/inventoryObjects';
import { InventoryCode } from '@/core/inventory/types';

interface InventoryObjectsTableProps {
  inventoryCode: InventoryCode;
  inventoryObjects: PaginatedInventoryObject;
}

export function InventoryObjectsTable({
  inventoryObjects,
  inventoryCode
}: InventoryObjectsTableProps) {
  const { items, pagination } = inventoryObjects;

  const columns = React.useMemo<ColumnDef<InventoryObject, unknown>[]>(
    () => fetchInventoryObjectsTableColumnDefs(inventoryCode),
    []
  );

  const { dataTable } = useDataTable({
    data: items,
    columns,
    perPage: 20,
    pageCount: pagination.pagesCount
    // filterableColumns: filterableColumns()
  });

  return (
    <DataTable
      withSearch
      dataTable={dataTable}
      columns={columns}
      columnNames={InventoryObjectsTableColumnNames}
      // filterableColumns={filterableColumns()}
    />
  );
}
