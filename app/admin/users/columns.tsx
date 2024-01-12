'use client';

import { ColumnDef } from '@tanstack/react-table';
import { UserRoles, UserStatus } from '@/constants';

export type User = {};

export const columns: ColumnDef<User>[] = [
  { accessorKey: 'id', header: '№' },
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
        return 'Активен';
      }

      if (status === UserStatus.blocked) {
        return 'Заблокирован';
      }
    }
  },
  { accessorKey: 'organisationId', header: 'Организация' },
  { accessorKey: 'departmentId', header: 'Отдел' }
];
