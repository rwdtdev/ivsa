'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { EventView } from '@/server/services/events/types';
import Link from 'next/link';

const emptyCell = '';

export function fetchEventsTableColumnDefs(
  isPending: boolean,
  startTransition: React.TransitionStartFunction
): ColumnDef<EventView, unknown>[] {
  return [
    {
      id: 'commandId',
      accessorKey: 'commandId',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Распоряжение' />
      )
    },
    {
      id: 'commandNumber',
      accessorKey: 'commandNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Номер распоряжения' />
      )
    },
    {
      id: 'commandDate',
      accessorKey: 'commandDate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Дата распоряжения' />
      )
    },
    {
      id: 'orderId',
      accessorKey: 'orderId',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Приказ' />
    },
    {
      id: 'orderNumber',
      accessorKey: 'orderNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Номер приказа' />
      )
    },
    {
      id: 'orderDate',
      accessorKey: 'orderDate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Дата составления приказа' />
      )
    },
    {
      id: 'startAt',
      accessorKey: 'startAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Дата начала инвентаризации' />
      )
    },
    {
      id: 'endAt',
      accessorKey: 'endAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Дата окончания инвентаризации' />
      )
    },
    {
      id: 'balanceUnit',
      accessorKey: 'balanceUnit',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Балансовая единица' />
      )
    },
    {
      id: 'balanceUnitRegionCode',
      accessorKey: 'balanceUnitRegionCode',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Код региона' />
      )
    },
    {
      id: 'participants',
      accessorKey: 'participants',
      header: 'Участники',
      cell: ({ row }) => {
        // @ts-ignore
        const { participants } = row.original;

        if (participants && participants.length > 0) {
          // @TODO: Найти главного в списке
          const participant = participants[0];
          return (
            <Link href={`/admin/users/${participant.id}`}>
              {participant.name} (Участников: {participants.length})
            </Link>
          );
        }
      }
    }
  ];
}

export const eventsDatePickers = [
  {
    ids: ['startAt', 'endAt'],
    type: 'range',
    title: 'Период'
  }
];
