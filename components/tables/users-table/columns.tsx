'use client';

import moment from 'moment';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './row-actions';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { UserRoles, UserStatuses } from '@/constants';
import { UserRole, UserStatus } from '@prisma/client';
import { AlertTriangleIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { UserView } from '@/types/user';

const emptyCell = '';

export function fetchUsersTableColumnDefs(
  isPending: boolean,
  startTransition: React.TransitionStartFunction
): ColumnDef<UserView, unknown>[] {
  return [
    {
      id: 'select',
      accessorKey: 'select',
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
      id: 'name',
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title='ФИО' />
    },
    {
      id: 'username',
      accessorKey: 'username',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Логин' />
    },
    {
      id: 'email',
      accessorKey: 'email',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Эл. почта' />
    },
    {
      id: 'phone',
      accessorKey: 'phone',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Телефон' />
    },
    {
      id: 'role',
      accessorKey: 'role',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Роли' />,
      cell: ({ row }) => {
        const role = row.getValue('role') as UserRole;

        return UserRoles[role] || emptyCell;
      }
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Статус' />,
      cell: ({ row }) => {
        let status: string = row.getValue('status');

        let isPasswordExpired = false;
        const { lastUpdatePasswordDate } = row.original;

        const currentDatetime = moment();
        const passwordExpireDatetime = moment(lastUpdatePasswordDate).add(90, 'days');

        if (currentDatetime.valueOf() >= passwordExpireDatetime.valueOf()) {
          isPasswordExpired = true;
        }

        const WarnComponent = (props: any) =>
          isPasswordExpired && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger {...props}>
                  <AlertTriangleIcon color='#f59e0b' />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Время действия пароля истекло</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );

        if (status === UserStatus.ACTIVE) {
          return (
            <div className='relative inline-block align-middle'>
              <Badge
                variant='secondary'
                className='pointer-events-none bg-green-300 py-1 hover:bg-green-300'
              >
                {UserStatuses[status]}
              </Badge>
              <WarnComponent className='absolute bottom-0.5 ml-2' />
            </div>
          );
        }

        if (status === UserStatus.BLOCKED) {
          return (
            <div className='relative inline-block align-middle'>
              <Badge
                variant='secondary'
                className='pointer-events-none bg-red-300 py-1 hover:bg-red-300'
              >
                {UserStatuses[status]}
              </Badge>
              <WarnComponent className='absolute bottom-0.5 ml-2' />
            </div>
          );
        }

        if (status === UserStatus.RECUSED) {
          return (
            <div className='relative inline-block align-middle'>
              <WarnComponent />
              <Badge
                variant='secondary'
                className='pointer-events-none bg-yellow-300 py-1 hover:bg-yellow-300'
              >
                {UserStatuses[status]}
              </Badge>
              <WarnComponent className='absolute bottom-0.5 ml-2' />
            </div>
          );
        }
      }
    },
    {
      id: 'tabelNumber',
      accessorKey: 'tabelNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Табельный номер' />
      ),
      cell: ({ row }) => row.getValue('tabelNumber')
    },
    {
      id: 'organisation',
      accessorKey: 'organisation',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Организация' />
      ),
      cell: ({ row }) => {
        const organisation = row.original.organisation;

        return organisation ? organisation.name : emptyCell;
      }
    },
    {
      id: 'department',
      accessorKey: 'department',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Отдел' />,
      cell: ({ row }) => {
        const department = row.original.department;
        return department ? department.name : emptyCell;
      }
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => <CellAction data={row.original} />
    }
  ];
}
