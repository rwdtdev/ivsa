'use client';

import * as React from 'react';
import Link from 'next/link';
import type { DataTableFilterableColumn, DataTableSearchableColumn } from '@/types';
import { Cross2Icon, PlusCircledIcon, TrashIcon } from '@radix-ui/react-icons';
import type { Table } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableFacetedFilter } from '@/components/ui/data-table/data-table-faceted-filter';
import { DataTableViewOptions } from '@/components/ui/data-table/data-table-view-options';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';
import { DatePickerWithRange } from '../../date-picker-range';
import {
  EventsTableColumnNames,
  UsersTableColumnNames
} from '@/constants/mappings/tables-column-names';
import { Inventory } from '@prisma/client';
import { ConfirmModalDialogToolbarBtn } from '@/components/modal/confirm-modal-dialog-toolbar-btn';
import { DatePickerUsersExpiresAt } from '@/components/date-picker-users-expiresat';
import { TableType } from './data-table';
import InventorySelectMenu from '@/components/inventory-select-menu';
import { blockUserAction, unblockUserAction } from '@/app/actions/server/users';
import { PrintBtn } from '@/components/print-btn';
import { ExportToXlsxBtn } from '@/components/export-to-xlsx-btn';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterableColumns?: DataTableFilterableColumn<TData>[];
  searchableColumns?: DataTableSearchableColumn<TData>[];
  datePickers?: any;
  columnNames: typeof UsersTableColumnNames | typeof EventsTableColumnNames | {};
  withSearch?: boolean;
  newRowLink?: string;
  deleteRowsAction?: React.MouseEventHandler<HTMLButtonElement>;
  isUsersTable?: boolean;
  tableType?: TableType;
  inventories?: Inventory[];
}

export function DataTableToolbar<TData>({
  table,
  filterableColumns = [],
  columnNames = {},
  datePickers = [],
  withSearch = false,
  newRowLink,
  deleteRowsAction,
  tableType,
  inventories
}: DataTableToolbarProps<TData>) {
  const [query, setQuery] = React.useState('');
  const [isFiltered, setFiltered] = React.useState(false);
  const debounceValue = useDebounce(query, 300);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = React.useTransition();
  const isUsersTable = tableType === 'usersTable';
  const isInventoriesTable = tableType === 'inventoriesTable';
  const isMonitoringTable = tableType === 'monitoringTable';
  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams]
  );

  async function blockSelectedUsers() {
    const selectedUsersObj = table.getState().rowSelection;
    const usersIds: string[] = Object.keys(selectedUsersObj);
    await Promise.allSettled(usersIds.map((userId) => blockUserAction(userId)));
    table.resetRowSelection();
  }

  async function unblockSelectedUsers() {
    const selectedUsersObj = table.getState().rowSelection;
    const usersIds: string[] = Object.keys(selectedUsersObj);
    await Promise.allSettled(usersIds.map((userId) => unblockUserAction(userId)));
    table.resetRowSelection();
  }

  React.useEffect(() => {
    if (debounceValue.length > 0) {
      router.push(
        `${pathname}?${createQueryString({
          page: searchParams.get('page'),
          per_page: searchParams.get('per_page'),
          search: debounceValue
        })}`,
        {
          scroll: false
        }
      );
    }

    if (!debounceValue || debounceValue.length === 0) {
      router.push(
        `${pathname}?${createQueryString({
          page: searchParams.get('page'),
          per_page: searchParams.get('per_page'),
          search: null
        })}`,
        {
          scroll: false
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceValue]);

  return (
    <div className='flex w-full items-center justify-between space-x-2 overflow-auto'>
      <div className='flex flex-1 items-center space-x-2'>
        {withSearch && (
          <Input
            placeholder={`Поиск...`}
            value={query}
            onChange={(event) => {
              const value = event?.target.value;

              if (value === '') {
                setQuery('');
                setFiltered(false);
              } else {
                setQuery(value);
                setFiltered(true);
              }
            }}
            className='h-8 w-[150px] focus:border-2 focus:border-black lg:w-[250px]'
          />
        )}
        {datePickers.length > 0 &&
          datePickers.map(
            // @ts-expect-error any type
            (datepicker, idx) =>
              datepicker.type === 'range' && (
                <div key={idx} className='flex flex-row items-center'>
                  <DatePickerWithRange />
                </div>
              )
          )}

        {filterableColumns.length > 0 &&
          filterableColumns.map(
            (column) =>
              table.getColumn(column.id ? String(column.id) : '') && (
                <DataTableFacetedFilter
                  key={String(column.id)}
                  column={table.getColumn(column.id ? String(column.id) : '')}
                  title={column.title}
                  options={column.options}
                />
              )
          )}

        {isFiltered && (
          <Button
            aria-label='Reset filters'
            variant='ghost'
            className='h-8 px-2 lg:px-3'
            onClick={() => {
              setQuery('');
              setFiltered(false);
            }}
          >
            Сбросить
            <Cross2Icon className='ml-2 size-4' aria-hidden='true' />
          </Button>
        )}
        {isInventoriesTable && <InventorySelectMenu inventories={inventories} />}
      </div>
      <div className='flex items-center space-x-2'>
        {isUsersTable && table.getSelectedRowModel().rows.length > 0 && (
          <DatePickerUsersExpiresAt table={table} />
        )}

        {isUsersTable && table.getSelectedRowModel().rows.length > 0 && (
          <ConfirmModalDialogToolbarBtn
            btnText='Заблокировать'
            title='Хотите заблокировать выбранных пользователей?'
            msg='У выбранных пользователей будет заблокирован доступ к реестру инвентаризаций.'
            ariaLabel='Кнопка заблокировать пользователя'
            variant='outline'
            size='sm'
            className='h-8 bg-gray-100'
            action={blockSelectedUsers}
          />
        )}

        {isUsersTable && table.getSelectedRowModel().rows.length > 0 && (
          <ConfirmModalDialogToolbarBtn
            btnText='Разблокировать'
            title='Хотите разблокировать выбранных пользователей?'
            msg='Выбранным пользователям будет предоставлен доступ к реестру инвентаризаций.'
            ariaLabel='Кнопка разблокировать пользователя'
            variant='outline'
            size='sm'
            className='h-8 bg-gray-100'
            action={unblockSelectedUsers}
          />
        )}

        {deleteRowsAction && table.getSelectedRowModel().rows.length > 0 ? (
          <Button
            aria-label='Delete selected rows'
            variant='outline'
            size='sm'
            className='h-8 bg-gray-100'
            onClick={(event) => {
              startTransition(() => {
                table.toggleAllPageRowsSelected(false);
                deleteRowsAction(event);
              });
            }}
            disabled={isPending}
          >
            <TrashIcon className='mr-2 size-4' aria-hidden='true' />
            Удалить
          </Button>
        ) : newRowLink && isUsersTable ? (
          <Link aria-label='Create new row' href={newRowLink}>
            <div
              className={cn(
                buttonVariants({
                  variant: 'outline',
                  size: 'sm',
                  className: 'h-8 bg-gray-100'
                })
              )}
            >
              <PlusCircledIcon className='mr-2 size-4' aria-hidden='true' />
              Добавить
            </div>
          </Link>
        ) : null}
        {isMonitoringTable && (
          <>
            {/* <Button
              variant='outline'
              size='sm'
              className='h-8'
              onClick={async () => {
                const res = await getAllMonitoringData();
                console.log('🚀 ~ onClick={ ~ res:', res);
              }}
            >
              <Upload size={20} stroke='slategrey' />
            </Button> */}
            <ExportToXlsxBtn />
            <PrintBtn />
          </>
        )}

        {!isMonitoringTable && (
          <DataTableViewOptions table={table} columnNames={columnNames} />
        )}
      </div>
    </div>
  );
}
