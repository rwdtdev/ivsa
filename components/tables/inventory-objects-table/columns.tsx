'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header';
import { InventoryObject } from '@prisma/client';
import {
  InventoryObjectsTableColumnNames,
  makeColumnsNames
} from '@/constants/mappings/tables-column-names';
import { InventoryCode } from '@/core/inventory/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

const padding = 9;

const getColumnNameById = makeColumnsNames(InventoryObjectsTableColumnNames);

export function fetchInventoryObjectsTableColumnDefs(
  code: InventoryCode
): ColumnDef<InventoryObject, unknown>[] {
  switch (code) {
    case InventoryCode.I01A01:
      return columns.filter(({ id }) =>
        [
          'name',
          'location',
          'inventoryNumber',
          'serialNumber',
          'networkNumber',
          'passportNumber',
          'quantity',
          'state'
        ].includes(id as string)
      );

    // INV-3
    case InventoryCode.I02001:
    case InventoryCode.I02A02:
      return columns.filter(({ id }) =>
        [
          'name',
          'nomenclatureNumber',
          'unitCode',
          'unitName',
          'inventoryNumber',
          'passportNumber',
          'batchNumber',
          'quantity'
        ].includes(id as string)
      );

    // INV-5
    case InventoryCode.I02F01:
    case InventoryCode.I02F02:
    case InventoryCode.I02F03:
    case InventoryCode.I02F04:
      return columns.filter(({ id }) =>
        [
          'name',
          'nomenclatureNumber',
          'serialNumber',
          'placement',
          'unitCode',
          'unitName',

          'batchNumber',
          'quantity'
        ].includes(id as string)
      );

    // FNU-49
    case InventoryCode.I01011:
      return columns.filter(({ id }) =>
        [
          'name',
          'nomenclatureNumber',
          'inventoryNumber',
          'serialNumber',
          'quantity'
        ].includes(id as string)
      );

    // FNU-50
    case InventoryCode.I02G01:
    case InventoryCode.I02G02:
      return columns.filter(({ id }) =>
        [
          'name',
          'nomenclatureNumber',
          'inventoryNumber',
          'serialNumber',
          'unitCode',
          'unitName',
          'quantity'
        ].includes(id as string)
      );

    // FNU-55
    case InventoryCode.I02011:
    case InventoryCode.I02G11:
    case InventoryCode.I02G22:
      return columns.filter(({ id }) =>
        [
          'name',
          'nomenclatureNumber',
          'unitCode',
          'unitName',
          'batchNumber',
          'quantity'
        ].includes(id as string)
      );
  }
}

const columns: ColumnDef<InventoryObject, unknown>[] = [
  {
    id: 'inventoryNumber',
    accessorKey: 'inventoryNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={getColumnNameById(column.id)} />
    ),
    cell: ({ row }) => {
      return <div style={{ padding }}>{row.original.inventoryNumber}</div>;
    }
  },
  {
    id: 'location',
    accessorKey: 'location',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={getColumnNameById(column.id)} />
    ),
    cell: ({ row }) => {
      return <div style={{ padding }}>{row.original.location}</div>;
    }
  },
  {
    id: 'serialNumber',
    accessorKey: 'serialNumber',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={getColumnNameById(column.id)} />
    ),
    cell: ({ row }) => {
      return <div style={{ padding }}>{row.original.serialNumber}</div>;
    }
  },
  {
    id: 'networkNumber',
    accessorKey: 'networkNumber',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={getColumnNameById(column.id)} />
    ),
    cell: ({ row }) => {
      return <div style={{ padding }}>{row.original.networkNumber}</div>;
    }
  },
  {
    id: 'passportNumber',
    accessorKey: 'passportNumber',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={getColumnNameById(column.id)} />
    ),
    cell: ({ row }) => {
      return <div style={{ padding }}>{row.original.passportNumber}</div>;
    }
  },
  {
    id: 'quantity',
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={getColumnNameById(column.id)} />
    ),
    cell: ({ row }) => {
      return (
        <div style={{ padding }}>
          {row.original.quantity} {row.original.unitName}.
        </div>
      );
    }
  },
  {
    id: 'state',
    accessorKey: 'state',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={getColumnNameById(column.id)} />
    ),
    cell: ({ row }) => {
      return <div style={{ padding }}>{row.original.state}</div>;
    }
  },
  {
    id: 'name',
    accessorKey: 'name',
    enableResizing: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={getColumnNameById(column.id)} />
    ),
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div
                style={{
                  padding,
                  overflowX: 'hidden',
                  textWrap: 'nowrap',
                  maxWidth: 300
                }}
              >
                {row.original.name}
              </div>
            </TooltipTrigger>
            <TooltipContent side='top' align='end'>
              <p> {row.original.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
  },
  {
    id: 'batchNumber',
    accessorKey: 'batchNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={getColumnNameById(column.id)} />
    ),
    cell: ({ row }) => {
      return <div style={{ padding }}>{row.original.batchNumber}</div>;
    }
  },
  {
    id: 'placement',
    accessorKey: 'placement',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={getColumnNameById(column.id)} />
    ),
    cell: ({ row }) => {
      return <div style={{ padding, textWrap: 'nowrap' }}>{row.original.placement}</div>;
    }
  }
];
