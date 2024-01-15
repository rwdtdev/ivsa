'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Badge } from '@/components/ui/badge';
// import { User } from '@/constants/data';
import { Checkbox } from '@/components/ui/checkbox';
import { User } from '@prisma/client';
import { UserRoles, UserStatus } from '@/constants';

export const columns: ColumnDef<User>[] = [
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
    accessorKey: 'roles',
    header: 'Роли',
    cell: ({ row }) => {
      const stringOfRoles: string = row.getValue('roles');
      const roles = stringOfRoles.split(',');

      if (!roles.length) return '';

      return (
        <ul>
          {roles.map((role, index) => {
            if (UserRoles[role as keyof typeof UserRoles]) {
              return (
                <li key={index}>
                  {UserRoles[role as keyof typeof UserRoles].ru}
                </li>
              );
            }
          })}
        </ul>
      );
    }
  },
  {
    accessorKey: 'status',
    header: 'Статус',
    cell: ({ row }) => {
      const status: string = row.getValue('status');

      if (status === UserStatus.active) {
        return (
          <Badge
            variant='secondary'
            className='pointer-events-none bg-green-300 hover:bg-green-300'
          >
            Активен
          </Badge>
        );
      }

      if (status === UserStatus.blocked) {
        return (
          <Badge
            variant='secondary'
            className='pointer-events-none bg-red-300 hover:bg-red-300'
          >
            Заблокирован
          </Badge>
        );
      }
    }
  },
  {
    accessorKey: 'organisationId',
    header: 'Организация',
    cell: ({ row }) => row.getValue('organisationId') || '-'
  },
  {
    accessorKey: 'departmentId',
    header: 'Отдел',
    cell: ({ row }) => row.getValue('departmentId') || '-'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
