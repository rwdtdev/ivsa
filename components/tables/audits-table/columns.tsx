'use client';

import moment from 'moment';
import { ColumnDef } from '@tanstack/react-table';
// import { CellAction } from './row-actions';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { UserRoles, UserStatuses } from '@/constants';
import { UserTableView } from '@/types/composition';
import { UserRole, UserStatus } from '@prisma/client';
import { DataTableFilterableColumn, DataTableSearchableColumn } from '@/types';
import { AlertCircleIcon, AlertTriangleIcon } from 'lucide-react';
import {
  HoverCardTrigger,
  HoverCard,
  HoverCardContent
} from '@/components/ui/hover-card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

const emptyCell = '';

export function fetchAuditsTableColumnDefs(
  isPending: boolean,
  startTransition: React.TransitionStartFunction
): ColumnDef<any, unknown>[] {
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
    // { accessorKey: 'id', header: '№', cell: ({ row }) => row.index },
    { accessorKey: 'commandId', header: 'Распоряжение' },
    { accessorKey: 'commandNumber', header: 'Номер распоряжения' },
    { accessorKey: 'commandDate', header: 'Дата распоряжения' },
    { accessorKey: 'orderId', header: 'Приказ' },
    { accessorKey: 'orderNumber', header: 'Номер приказа' },

    { accessorKey: 'orderDate', header: 'Дата составления приказа' },
    { accessorKey: 'auditStart', header: 'Дата начала инвентаризации' },
    { accessorKey: 'auditEnd', header: 'Дата окончания инвентаризации' },
    { accessorKey: 'balanceUnit', header: 'Балансовая единица' },
    {
      accessorKey: 'participants',
      header: 'Участники',
      cell: ({ row }) => {
        const { participants } = row.original;

        return participants.map((participant: any) => <p>{participant.tabelNumber}</p>);
      }
    }
    // {
    //   id: 'actions',
    //   enableHiding: false,
    //   cell: ({ row }) => <CellAction data={row.original} />
    // }
  ];
}

// export const filterableColumns: DataTableFilterableColumn<User>[] = [
//   {
//     id: 'status',
//     title: 'Status',
//     options: tasks.status.enumValues.map((status) => ({
//       label: status[0]?.toUpperCase() + status.slice(1),
//       value: status
//     }))
//   },
//   {
//     id: 'priority',
//     title: 'Priority',
//     options: tasks.priority.enumValues.map((priority) => ({
//       label: priority[0]?.toUpperCase() + priority.slice(1),
//       value: priority
//     }))
//   }
// ];

export const searchableColumns: DataTableSearchableColumn<any>[] = [
  {
    id: 'username',
    title: 'Логин'
  }
];
