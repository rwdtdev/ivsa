'use client';

import _ from 'underscore';
import moment from 'moment';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './row-actions';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { UserRoles, UserStatuses } from '@/constants/mappings/prisma-enums';
import { Department, Organisation, UserRole, UserStatus } from '@prisma/client';
import { AlertTriangleIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header';
import { UserView } from '@/types/user';
import { DataTableFilterableColumn } from '@/types';
import { format } from 'date-fns';

const emptyCell = '';

export function fetchUsersTableColumnDefs(): ColumnDef<UserView, unknown>[] {
  // isPending: boolean,
  // startTransition: React.TransitionStartFunction
  return [
    {
      id: 'id',
      accessorKey: 'id',
      enableHiding: false
    },
    {
      id: 'select',
      accessorKey: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          style={{ marginLeft: 8 }}
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
          aria-label='Select row'
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ФИО' className='min-w-36' />
      ),
      cell: ({ row }) => {
        return <div style={{ padding: 10 }}>{row.original.name}</div>;
      }
    },
    {
      id: 'username',
      accessorKey: 'username',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Логин' />
    },
    {
      id: 'email',
      accessorKey: 'email',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Эл. почта' />,
      cell: ({ row }) => {
        return <div style={{ padding: 10 }}>{row.original.email}</div>;
      }
    },
    {
      id: 'phone',
      accessorKey: 'phone',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Телефон' className='min-w-32' />
      )
    },
    {
      id: 'role',
      accessorKey: 'role',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Роли' />,
      cell: ({ row }) => {
        const role = row.getValue('role') as UserRole;

        return <div style={{ padding: 10 }}>{UserRoles[role]}</div> || emptyCell;
      }
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Статус' />,
      cell: ({ row }) => {
        const status: string = row.getValue('status');

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
                className='pointer-events-none bg-green-200 py-1 hover:bg-green-200'
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
                className='pointer-events-none bg-red-200 py-1 hover:bg-red-200'
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
                className='pointer-events-none bg-gray-200 py-1 hover:bg-gray-200'
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
      id: 'expiresAt',
      accessorKey: 'expiresAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Действует до' />
      ),
      cell: ({ row }) => (
        <div style={{ padding: 10 }}>{format(row.original.expiresAt, 'dd.MM.yyyy')}</div>
      )
    },
    {
      id: 'tabelNumber',
      accessorKey: 'tabelNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Табельный номер' />
      ),
      cell: ({ row }) => <div style={{ padding: 10 }}>{row.getValue('tabelNumber')}</div>
    },
    {
      id: 'ASOZSystemRequestNumber',
      accessorKey: 'ASOZSystemRequestNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Номер заявки в АС ОЗ' />
      ),
      cell: ({ row }) => <div style={{ padding: 10 }}>{row.getValue('ASOZSystemRequestNumber')}</div>
    },
    // @TODO: disable while not exist data dictionaries with organisations and departments
    // {
    //   id: 'organisation',
    //   accessorKey: 'organisation',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title='Организация' />
    //   ),
    //   cell: ({ row }) => {
    //     const organisation = row.original.organisation;

    //     return organisation ? organisation.name : emptyCell;
    //   }
    // },
    // {
    //   id: 'department',
    //   accessorKey: 'department',
    //   header: ({ column }) => <DataTableColumnHeader column={column} title='Отдел' />,
    //   cell: ({ row }) => {
    //     const department = row.original.department;
    //     return department ? department.name : emptyCell;
    //   }
    // },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => <CellAction data={row.original} />
    }
  ];
}

export const filterableColumns = (
  departments: Department[],
  organisations: Organisation[]
): DataTableFilterableColumn<UserView>[] => [
  {
    id: 'status',
    title: 'Статус',
    options: _.keys(UserStatuses).map((key) => {
      const value = UserStatuses[key as keyof typeof UserStatuses];

      return {
        label: value[0]?.toUpperCase() + value.slice(1),
        value: key
      };
    })
  },
  {
    id: 'role',
    title: 'Роль',
    options: _.keys(UserRoles).map((key) => {
      const value = UserRoles[key as keyof typeof UserRoles];

      return {
        label: value[0]?.toUpperCase() + value.slice(1),
        value: key
      };
    })
  },
  {
    id: 'department',
    title: 'Отдел',
    options: departments.map((department) => ({
      label: department.name[0]?.toUpperCase() + department.name.slice(1),
      value: department.id
    }))
  },
  {
    id: 'organisation',
    title: 'Организация',
    options: organisations.map((organisation) => ({
      label: organisation.name[0]?.toUpperCase() + organisation.name.slice(1),
      value: organisation.id
    }))
  }
];
