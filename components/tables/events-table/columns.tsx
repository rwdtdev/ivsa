'use client';

import { ColumnDef, HeaderContext } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header';
import { EventView } from '@/core/event/types';
import { BriefingStatus, EventStatus, ParticipantRole } from '@prisma/client';
import {
  BriefingStatuses,
  EventStatuses,
  ParticipantRoles
} from '@/constants/mappings/prisma-enums';
import { BriefingStatusBadge, EventStatusBadge } from '@/components/event-status-badge';
import { DataTableFilterableColumn } from '@/types';
import { REGION_CODES } from '@/constants/mappings/region-codes';
import {
  EventsTableColumnNames,
  makeColumnsNames
} from '@/constants/mappings/tables-column-names';
import { format, parseISO } from 'date-fns';

// const padding = 9;

const getColumnNameById = makeColumnsNames(EventsTableColumnNames);

const defaultHeader = ({ column }: HeaderContext<EventView, unknown>) => (
  <DataTableColumnHeader column={column} title={getColumnNameById(column.id)} />
);

export function fetchEventsTableColumnDefs(): ColumnDef<EventView, unknown>[] {
  return [
    {
      id: 'startAt',
      accessorKey: 'startAt',
      header: defaultHeader,
      cell: ({ row }) =>
        // <div style={{ padding }}>
        //   {format(parseISO(row.original.startAt.slice(0, 10)), 'dd.MM.yyyy')}
        // </div>
        format(parseISO(row.original.startAt.slice(0, 10)), 'dd.MM.yyyy')
    },
    {
      id: 'endAt',
      accessorKey: 'endAt',
      header: defaultHeader,
      cell: ({ row }) =>
        // <div style={{ padding }}>
        //   {format(parseISO(row.original.endAt.slice(0, 10)), 'dd.MM.yyyy')}
        // </div>
        format(parseISO(row.original.endAt.slice(0, 10)), 'dd.MM.yyyy')
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: () => <div className='min-w-24 text-center'>Статус инвентаризации</div>,
      cell: ({ row }) => <EventStatusBadge status={row.original.status} />
    },
    {
      id: 'briefingStatus',
      accessorKey: 'briefingStatus',
      header: () => <div className='min-w-28'>Инструктаж</div>,
      cell: ({ row }) => <BriefingStatusBadge status={row.original.briefingStatus} />
    },
    {
      id: 'balanceUnit',
      accessorKey: 'balanceUnit',
      header: defaultHeader
      // cell: ({ row }) => <div style={{ padding }}>{row.original.balanceUnit}</div>
    },
    {
      id: 'balanceUnitRegionCode',
      accessorKey: 'balanceUnitRegionCode',
      header: defaultHeader,
      cell: ({ row }) =>
        // <div style={{ padding }}>
        //   {REGION_CODES[row.original.balanceUnitRegionCode as keyof typeof REGION_CODES]}
        // </div>
        REGION_CODES[row.original.balanceUnitRegionCode as keyof typeof REGION_CODES]
    },
    {
      id: 'commandNumber',
      accessorKey: 'commandNumber',
      header: defaultHeader
      // cell: ({ row }) => <div style={{ padding }}>{row.original.commandNumber}</div>
    },
    {
      id: 'commandDate',
      accessorKey: 'commandDate',
      header: defaultHeader,
      cell: ({ row }) =>
        // <div style={{ padding }}>
        //   {format(parseISO(row.original.commandDate.slice(0, 10)), 'dd.MM.yyyy')}
        // </div>
        format(parseISO(row.original.commandDate.slice(0, 10)), 'dd.MM.yyyy')
    },
    {
      id: 'orderNumber',
      accessorKey: 'orderNumber',
      header: defaultHeader
      // cell: ({ row }) => <div style={{ padding }}>{row.original.orderNumber}</div>
    },
    {
      id: 'orderDate',
      accessorKey: 'orderDate',
      header: defaultHeader,
      cell: ({ row }) =>
        // <div style={{ padding }}>
        //   {format(parseISO(row.original.orderDate.slice(0, 10)), 'dd.MM.yyyy')}
        // </div>
        format(parseISO(row.original.orderDate.slice(0, 10)), 'dd.MM.yyyy')
    },
    {
      id: 'participants',
      accessorKey: 'participants',
      header: () => <div className='min-w-48'>Участники</div>,

      cell: ({ row }) => {
        const { participants } = row.original;

        if (!participants || participants.length === 0) {
          return <div style={{}}></div>;
        }

        const participantsRolesCounts = participants
          .map(({ role }) => role)
          .reduce(
            (acc: Record<string, number>, cur: ParticipantRole) => (
              (acc[cur] = acc[cur] + 1 || 1), acc
            ),
            {}
          );

        return (
          // <div style={{ padding }}>
          <ul>
            {Object.entries(participantsRolesCounts).map(([key, value]) => (
              <li key={key}>
                {ParticipantRoles[key as ParticipantRole]} ({value})
              </li>
            ))}
          </ul>
          // </div>
        );
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
      options: [EventStatus.ACTIVE, EventStatus.REMOVED].map((status) => {
        const value = EventStatuses[status];

        return {
          label: value[0]?.toUpperCase() + value.slice(1),
          value: status
        };
      })
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
