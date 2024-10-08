'use client';
import _ from 'underscore';
import moment from 'moment';
import { ColumnDef } from '@tanstack/react-table';
import { UserTableRowMenu } from './user-table-row-menu';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AccountExpiration,
  UserRoles,
  UserStatuses
} from '@/constants/mappings/prisma-enums';
import { UserRole, UserStatus } from '@prisma/client';
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

export function fetchUsersTableColumnDefs(
  userRole: UserRole | undefined
): ColumnDef<UserView, unknown>[] {
  return [
    {
      id: 'id',
      accessorKey: 'id',
      enableHiding: false
    },
    {
      id: 'select',
      accessorKey: 'select',
      header: ({ table }) =>
        userRole === UserRole.USER_ADMIN ? (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label='Select all'
          />
        ) : null,
      cell: ({ row }) =>
        userRole === UserRole.USER_ADMIN ? (
          <Checkbox
            // style={{ marginLeft: 8 }}
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);
            }}
            aria-label='Select row'
          />
        ) : null,
      enableSorting: false,
      enableHiding: false
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ФИО' className='min-w-36' />
      )
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
        // return <div style={{ padding: 10 }}>{UserRoles[role]}</div> || emptyCell;
        return UserRoles[role] || emptyCell;
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
      }
    },
    {
      id: 'expiresAt',
      accessorKey: 'expiresAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Действует до' />
      ),
      cell: ({ row }) =>
        // <div style={{ padding: 10 }}>{format(row.original.expiresAt, 'dd.MM.yyyy')}</div>
        {
          if (row.original.expiresAt.getTime() >= new Date().getTime()) {
            return (
              <div className='relative inline-block align-middle'>
                <Badge
                  variant='secondary'
                  className='pointer-events-none bg-green-200 py-1 hover:bg-green-200'
                >
                  {format(row.original.expiresAt, 'dd.MM.yyyy')}
                </Badge>
              </div>
            );
          } else {
            return (
              <div className='relative inline-block align-middle'>
                <Badge
                  variant='secondary'
                  className='pointer-events-none bg-red-200 py-1 hover:bg-red-200'
                >
                  {format(row.original.expiresAt, 'dd.MM.yyyy')}
                </Badge>
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
      )
      // cell: ({ row }) => <div style={{ padding: 10 }}>{row.getValue('tabelNumber')}</div>
    },
    {
      id: 'ASOZSystemRequestNumber',
      accessorKey: 'ASOZSystemRequestNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Номер&nbsp;заявки в&nbsp;АС ОЗ' />
      ),
      cell: ({ row }) => (
        <div style={{ padding: 10 }}>{row.getValue('ASOZSystemRequestNumber')}</div>
      )
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) =>
        userRole === UserRole.USER_ADMIN ? <UserTableRowMenu data={row.original} /> : null
    }
  ];
}

export const filterableColumns = (): DataTableFilterableColumn<UserView>[] => [
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
    id: 'expiresAt',
    title: `Срок\u00A0действ.\u00A0уч.зап.`,
    options: _.keys(AccountExpiration).map((key) => {
      const value = AccountExpiration[key as keyof typeof AccountExpiration];

      return {
        label: value,
        value: key
      };
    })
  }
];
