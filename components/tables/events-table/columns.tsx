'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header';
import { EventView } from '@/server/services/events/types';
import Link from 'next/link';
import { BriefingStatus, EventStatus, UserRole } from '@prisma/client';
import {
  BriefingStatuses,
  EventStatuses,
  UserRoles
} from '@/constants/mappings/prisma-enums';
import { BriefingStatusBadge, EventStatusBadge } from '@/components/event-status-badge';
import { DataTableFilterableColumn } from '@/types';
import { REGION_CODES } from '@/constants/mappings/region-codes';

const padding = 9;

export function fetchEventsTableColumnDefs(): ColumnDef<EventView, unknown>[] {
  return [
    {
      id: 'startAt',
      accessorKey: 'startAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Дата начала' />
      ),
      cell: ({ row }) => {
        return (
          <Link href={`/admin/events/${row.original.id}`}>
            <div style={{ padding }}>{row.original.startAt}</div>
          </Link>
        );
      }
    },
    {
      id: 'endAt',
      accessorKey: 'endAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Дата окончания' />
      ),
      cell: ({ row }) => {
        return (
          <Link href={`/admin/events/${row.original.id}`}>
            <div style={{ padding }}>{row.original.endAt}</div>
          </Link>
        );
      }
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Статус' />,
      cell: ({ row }) => {
        return (
          <Link href={`/admin/events/${row.original.id}`}>
            <EventStatusBadge status={row.original.status} />
          </Link>
        );
      }
    },
    {
      id: 'briefingStatus',
      accessorKey: 'briefingStatus',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Иструктаж' />,
      cell: ({ row }) => {
        return (
          <Link href={`/admin/events/${row.original.id}`}>
            <BriefingStatusBadge status={row.original.briefingStatus} />
          </Link>
        );
      }
    },
    {
      id: 'balanceUnit',
      accessorKey: 'balanceUnit',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Балансовая единица' />
      ),
      cell: ({ row }) => {
        return (
          <Link href={`/admin/events/${row.original.id}`}>
            <div style={{ padding }}>{row.original.balanceUnit}</div>
          </Link>
        );
      }
    },
    {
      id: 'balanceUnitRegionCode',
      accessorKey: 'balanceUnitRegionCode',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Код региона' />
      ),
      cell: ({ row }) => {
        return (
          <Link href={`/admin/events/${row.original.id}`}>
            <div style={{ padding }}>
              {
                REGION_CODES[
                  row.original.balanceUnitRegionCode as keyof typeof REGION_CODES
                ]
              }
            </div>
          </Link>
        );
      }
    },
    {
      id: 'commandNumber',
      accessorKey: 'commandNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Номер распоряжения' />
      ),
      cell: ({ row }) => {
        return (
          <Link href={`/admin/events/${row.original.id}`}>
            <div style={{ padding }}>{row.original.commandNumber}</div>
          </Link>
        );
      }
    },
    {
      id: 'commandDate',
      accessorKey: 'commandDate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Дата распоряжения' />
      ),
      cell: ({ row }) => {
        return (
          <Link href={`/admin/events/${row.original.id}`}>
            <div style={{ padding }}>{row.original.commandDate}</div>
          </Link>
        );
      }
    },
    {
      id: 'orderNumber',
      accessorKey: 'orderNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Номер приказа' />
      ),
      cell: ({ row }) => {
        return (
          <Link href={`/admin/events/${row.original.id}`}>
            <div style={{ padding }}>{row.original.orderNumber}</div>
          </Link>
        );
      }
    },
    {
      id: 'orderDate',
      accessorKey: 'orderDate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Дата составления приказа' />
      ),
      cell: ({ row }) => {
        return (
          <Link href={`/admin/events/${row.original.id}`}>
            <div style={{ padding }}>{row.original.orderDate}</div>
          </Link>
        );
      }
    },
    {
      id: 'participants',
      accessorKey: 'participants',
      header: 'Участники',
      cell: ({ row }) => {
        const { participants } = row.original;

        if (participants && participants.length > 0) {
          return (
            <Link href={`/admin/events/${row.original.id}`}>
              <div style={{ padding }}>
                <ul>
                  {participants.map(({ role }: { role: UserRole }, idx) => (
                    <li key={idx}>{UserRoles[role]}</li>
                  ))}
                </ul>
              </div>
            </Link>
          );
        } else {
          return <div style={{ padding }}></div>;
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

export const filterableColumns = (): DataTableFilterableColumn<EventView>[] => {
  return [
    {
      id: 'status',
      title: 'Статус',
      options: [EventStatus.OPEN, EventStatus.CLOSED, EventStatus.REMOVED].map(
        (status) => {
          const value = EventStatuses[status];

          return {
            label: value[0]?.toUpperCase() + value.slice(1),
            value: status
          };
        }
      )
    },
    {
      id: 'briefingStatus',
      title: 'Инструктаж',
      options: [
        BriefingStatus.NOT_STARTED,
        BriefingStatus.IN_PROGRESS,
        BriefingStatus.PASSED
      ].map((status) => {
        const value = BriefingStatuses[status];

        return {
          label: value[0]?.toUpperCase() + value.slice(1),
          value: status
        };
      })
    }
  ];
};
