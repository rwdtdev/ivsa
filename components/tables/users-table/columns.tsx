'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './row-actions';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { UserRoles, UserStatuses } from '@/constants';
import { UserTableView } from '@/types/composition';
import { UserRole, UserStatus } from '@prisma/client';
import { DataTableFilterableColumn, DataTableSearchableColumn } from '@/types';

const emptyCell = '';

export function fetchUsersTableColumnDefs(
  isPending: boolean,
  startTransition: React.TransitionStartFunction
): ColumnDef<UserTableView, unknown>[] {
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
    { accessorKey: 'name', header: 'ФИО' },
    { accessorKey: 'username', header: 'Логин' },
    { accessorKey: 'email', header: 'Эл. почта' },
    { accessorKey: 'phone', header: 'Телефон' },
    {
      accessorKey: 'role',
      header: 'Роли',
      cell: ({ row }) => {
        const role = row.getValue('role') as UserRole;

        return UserRoles[role] || '';
      }
    },
    {
      accessorKey: 'status',
      header: 'Статус',
      cell: ({ row }) => {
        const status: string = row.getValue('status');

        if (status === UserStatus.ACTIVE) {
          return (
            <Badge
              variant='secondary'
              className='pointer-events-none bg-green-300 hover:bg-green-300'
            >
              {UserStatuses[status]}
            </Badge>
          );
        }

        if (status === UserStatus.BLOCKED) {
          return (
            <Badge
              variant='secondary'
              className='pointer-events-none bg-red-300 hover:bg-red-300'
            >
              {UserStatuses[status]}
            </Badge>
          );
        }

        if (status === UserStatus.RECUSED) {
          return (
            <Badge
              variant='secondary'
              className='pointer-events-none bg-yellow-300 hover:bg-yellow-300'
            >
              {UserStatuses[status]}
            </Badge>
          );
        }
      }
    },
    {
      accessorKey: 'tabelNumber',
      header: 'Табельный номер',
      cell: ({ row }) => row.getValue('tabelNumber')
    },
    {
      accessorKey: 'organisationName',
      header: 'Организация',
      cell: ({ row }) => row.getValue('organisationName') || emptyCell
    },
    {
      accessorKey: 'departmentName',
      header: 'Отдел',
      cell: ({ row }) => row.getValue('departmentName') || emptyCell
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => <CellAction data={row.original} />
    }
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

export const searchableColumns: DataTableSearchableColumn<UserTableView>[] = [
  {
    id: 'username',
    title: 'Логин'
  }
];
