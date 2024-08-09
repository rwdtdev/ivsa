import * as React from 'react';
import type { DataTableFilterableColumn, DataTableSearchableColumn } from '@/types';
import {
  flexRender,
  type ColumnDef,
  type Table as TanstackTable
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import { DataTableAdvancedToolbar } from './advanced/data-table-advanced-toolbar';
import { DataTableFloatingBar } from './data-table-floating-bar';
import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';
import { ScrollArea, ScrollBar } from '../scroll-area';
import { useRouter } from 'next/navigation';
import { Inventory } from '@prisma/client';

export type TableType =
  | 'usersTable'
  | 'eventsTable'
  | 'inventoriesTable'
  | 'monitoringTable';

interface DataTableProps<TData, TValue> {
  /**
   * The table instance returned from useDataTable hook with pagination, sorting, filtering, etc.
   * @type TanstackTable<TData>
   */
  dataTable: TanstackTable<TData>;

  /**
   * The columns of the table
   * @default []
   * @type ColumnDef<TData, TValue>[]
   */
  columns: ColumnDef<TData, TValue>[];

  /**
   * The searchable columns of the table
   * @default []
   * @type {id: keyof TData, title: string}[]
   * @example searchableColumns={[{ id: "title", title: "titles" }]}
   */
  searchableColumns?: DataTableSearchableColumn<TData>[];

  // Add global search input, fields controlled by backend
  withSearch?: boolean;

  withSelectedRows?: boolean;

  // Object-mapper column.id - hide column name
  columnNames: Record<string, string>;

  datePickers?: Array<Record<string, string>>;

  /**
   * The filterable columns of the table. When provided, renders dynamic faceted filters, and the advancedFilter prop is ignored.
   * @default []
   * @type {id: keyof TData, title: string, options: { label: string, value: string, icon?: React.ComponentType<{ className?: string }> }[]
   * @example filterableColumns={[{ id: "status", title: "Status", options: ["todo", "in-progress", "done", "canceled"]}]}
   */
  filterableColumns?: DataTableFilterableColumn<TData>[];

  /**
   * Show notion like filters when enabled
   * @default false
   * @type boolean
   */
  advancedFilter?: boolean;

  /**
   * The content to render in the floating bar on row selection, at the bottom of the table. When null, the floating bar is not rendered.
   * The datTable instance is passed as a prop to the floating bar content.
   * @default null
   * @type React.ReactNode | null
   * @example floatingBarContent={TasksTableFloatingBarContent(dataTable)}
   */
  floatingBarContent?: React.ReactNode | null;

  /**
   * The action to delete rows
   * @default undefined
   * @type React.MouseEventHandler<HTMLButtonElement> | undefined
   * @example deleteRowsAction={(event) => deleteSelectedRows(dataTable, event)}
   */
  deleteRowsAction?: React.MouseEventHandler<HTMLButtonElement>;

  tableType?: TableType;
  inventories?: Inventory[];
}

export function DataTable<TData, TValue>({
  dataTable,
  columns,
  searchableColumns = [],
  filterableColumns = [],
  columnNames = {},
  datePickers = [],
  withSearch = false,
  advancedFilter = false,
  floatingBarContent,
  withSelectedRows = false,
  deleteRowsAction,
  tableType,
  inventories
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const isEventsTable = tableType === 'eventsTable';

  return (
    <>
      <div className='mb-3'>
        {advancedFilter ? (
          <DataTableAdvancedToolbar
            dataTable={dataTable}
            filterableColumns={filterableColumns}
            searchableColumns={searchableColumns}
          />
        ) : (
          <DataTableToolbar
            table={dataTable}
            withSearch={withSearch}
            datePickers={datePickers}
            columnNames={columnNames}
            filterableColumns={filterableColumns}
            searchableColumns={searchableColumns}
            newRowLink='/admin/users/new'
            deleteRowsAction={deleteRowsAction}
            tableType={tableType}
            inventories={inventories}
          />
        )}
      </div>
      <ScrollArea className='mb-auto rounded-md border shadow-mod-1'>
        <Table className=''>
          <TableHeader className='bg-slate-50'>
            {dataTable.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {dataTable.getRowModel().rows?.length ? (
              dataTable.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={isEventsTable ? 'cursor-pointer' : ''}
                  onClick={() => {
                    if (isEventsTable) {
                      router.push(`/events/${row.id}`);
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} style={{ paddingLeft: 9 }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  Нет результатов.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
      <div className='pt-3'>
        <div className='rounded-md border p-1 shadow-mod-1'>
          <DataTablePagination withSelectedRows={withSelectedRows} table={dataTable} />
          {floatingBarContent ? (
            <DataTableFloatingBar table={dataTable}>
              {floatingBarContent}
            </DataTableFloatingBar>
          ) : null}
        </div>
      </div>
    </>
  );
}
