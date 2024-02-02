'use client';

import moment from 'moment';
import { ColumnDef } from '@tanstack/react-table';
// import { CellAction } from './row-actions';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { EventView } from '@/server/services/events/types';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { DataTableFilterableColumn } from '@/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { TypographyP } from '@/components/ui/typography/p';
import { UserStatus } from '@prisma/client';
import { UserRoles, UserStatuses } from '@/constants';

const emptyCell = '';

export function fetchEventsTableColumnDefs(
  isPending: boolean,
  startTransition: React.TransitionStartFunction
): ColumnDef<EventView, unknown>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
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
      id: 'participants',
      accessorKey: 'participants',
      header: 'Участники',
      cell: ({ row }) => {
        // @ts-ignore
        const { participants } = row.original;

        let StatusComp;

        if (participants.length && participants.length > 0) {
          return (
            <ul>
              {participants.map((participant: any) => {
                if (participant.status === UserStatus.ACTIVE) {
                  StatusComp = (
                    <div className='relative inline-block align-middle'>
                      <Badge
                        variant='secondary'
                        className='pointer-events-none bg-green-300 py-1 hover:bg-green-300'
                      >
                        {UserStatuses[participant.status]}
                      </Badge>
                    </div>
                  );
                }

                if (participant.status === UserStatus.BLOCKED) {
                  StatusComp = (
                    <div className='relative inline-block align-middle'>
                      <Badge
                        variant='secondary'
                        className='pointer-events-none bg-red-300 py-1 hover:bg-red-300'
                      >
                        {UserStatuses[participant.status]}
                      </Badge>
                    </div>
                  );
                }

                if (participant.status === UserStatus.RECUSED) {
                  StatusComp = (
                    <div className='relative inline-block align-middle'>
                      <Badge
                        variant='secondary'
                        className='pointer-events-none bg-yellow-300 py-1 hover:bg-yellow-300'
                      >
                        {UserStatuses[participant.status]}
                      </Badge>
                    </div>
                  );
                }

                return (
                  <li className='mt-2'>
                    <Link href={`/admin/users/${participant.id}`}>
                      {participant.name} ({participant.organisation.name},{' '}
                      {participant.department.name})
                    </Link>
                  </li>
                );
              })}
            </ul>
          );
        }
      }
    }
    // {
    //   id: 'actions',
    //   enableHiding: false,
    //   cell: ({ row }) => <CellAction data={row.original} />
    // }
  ];
}

export const eventsDatePickers = [
  {
    ids: ['startAt', 'endAt'],
    type: 'range',
    title: 'Период'
  }
];
