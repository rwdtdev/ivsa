'use client';

import { fetchInventoryObjectsTableColumnDefs } from './columns';
import React from 'react';
import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/ui/data-table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { InventoryObjectsTableColumnNames } from '@/constants/mappings/tables-column-names';
import { Inventory, InventoryObject } from '@prisma/client';
import { PaginatedInventoryObject } from '@/app/actions/server/inventoryObjects';
import { useSession } from 'next-auth/react';
// import { InventoryCode } from '@/core/inventory/types';

interface InventoryObjectsTableProps {
  inventory: Inventory;
  inventoryObjects: PaginatedInventoryObject;
  inventories: Inventory[];
}

export function InventoryObjectsTable({
  inventoryObjects,
  inventory,
  inventories
}: InventoryObjectsTableProps) {
  const session = useSession();
  const { items, pagination } = inventoryObjects;

  const columns = React.useMemo<ColumnDef<InventoryObject, unknown>[]>(
    () => fetchInventoryObjectsTableColumnDefs(inventory, session?.data?.user?.id),
    []
  );

  const { dataTable } = useDataTable({
    data: items,
    columns,
    // perPage: 10,
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
      tableType='inventoriesTable'
      inventories={inventories}
    />
  );
}
