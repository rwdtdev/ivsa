'use client';

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import { type Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  EventsTableColumnNames,
  UsersTableColumnNames
} from '@/constants/mappings/tables-column-names';

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  columnNames: typeof UsersTableColumnNames | typeof EventsTableColumnNames | {};
}

export function DataTableViewOptions<TData>({
  table,
  columnNames
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label='Toggle columns'
          variant='outline'
          size='sm'
          className='ml-auto hidden h-8 lg:flex'
        >
          <MixerHorizontalIcon className='mr-2 size-4' />
          Столбцы
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[240px]'>
        <DropdownMenuLabel>Видимость столбцов</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) => typeof column.accessorFn !== 'undefined' && column.getCanHide()
          )
          .map((column) => {
            console.log(column.id);
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className='capitalize'
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {columnNames[column.id as keyof typeof columnNames]}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
