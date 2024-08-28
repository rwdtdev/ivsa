import { ColumnDef, HeaderContext } from '@tanstack/react-table';
import { monitoringDetailMapper } from '@/constants/mappings/monitoring-detail-mapper';
import { format } from 'date-fns';
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header';
import { DataTableFilterableColumn } from '@/types';

import { actionStatusesMapper, actionTypesMapper } from '@/constants/actions';
import { Action, ActionStatus, ActionType } from '@prisma/client';
import { JsonObject, JsonValue } from '@prisma/client/runtime/library';

export function fetchSystemEventsTableColumns(): ColumnDef<Action, unknown>[] {
  return [
    {
      id: 'id',
      accessorKey: 'id',
      enableHiding: false
    },
    {
      id: 'actionAt',
      accessorKey: 'actionAt',
      header: ({ column }: HeaderContext<Action, unknown>) => (
        <DataTableColumnHeader column={column} title='Дата&nbsp;&nbsp;Время' />
      ),
      cell: ({ row }) =>
        format(row.original.actionAt, 'dd.MM.yyyy') +
        '\u00A0' +
        format(row.original.actionAt, 'HH:mm')
    },

    {
      id: 'ip',
      accessorKey: 'ip',
      header: () => <div>IP</div>
    },
    {
      id: 'initiator',
      accessorKey: 'initiator',
      header: () => <div>Инициатор</div>
    },
    {
      id: 'type',
      accessorKey: 'type',
      header: () => <div>Событие</div>,
      cell: ({ row }) => {
        const key = row.original.type;
        return actionTypesMapper[key];
      }
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: () => <div>Статус</div>,
      cell: ({ row }) =>
        row.original.status === 'SUCCESS' ? (
          <span className='text-green-800'>Успешно</span>
        ) : (
          <span className='text-red-800'>Ошибка</span>
        )
    },
    {
      id: 'details',
      accessorKey: 'details',
      header: () => <div className='pl-4'>Подробности</div>,
      cell: ({ row }) => objToHtml(row.original.details)
    }
  ];
}

export const monitoringDatePickers = [
  {
    ids: 'actionAt',
    type: 'range',
    title: 'Период'
  }
];

export const filterableColumns = (): DataTableFilterableColumn<Action>[] => {
  return [
    {
      id: 'type',
      title: 'Событие',
      options: Object.values(ActionType).map((eventType) => {
        return {
          label: actionTypesMapper[eventType],
          value: eventType
        };
      })
    },
    {
      id: 'status',
      title: 'Статус',
      options: Object.values(ActionStatus).map((actionStatus) => {
        return {
          label: actionStatusesMapper[actionStatus],
          value: actionStatus
        };
      })
    }
  ];
};

function objToHtml(obj2: JsonValue) {
  if (!obj2) return;

  const obj = obj2 as JsonObject;
  const keys = Object.keys(obj) as Array<keyof typeof monitoringDetailMapper>;
  return keys.map((key, i) => {
    const objKey = obj[key];

    if (Array.isArray(objKey)) {
      return (
        <div key={i} className='py-0.5 pl-4'>
          <span className='font-semibold'>{monitoringDetailMapper[key]}</span>:
          <p>{objKey.join(', ')}</p>
        </div>
      );
    } else if (typeof objKey === 'object') {
      return (
        <div key={i} className='pl-4'>
          <span className='font-bold'>{monitoringDetailMapper[key]}</span>:{' '}
          {objToHtml(objKey)}
        </div>
      );
    } else {
      return (
        <div key={i + String(objKey)} className='py-0.5 pl-4'>
          <span className='font-semibold'>{monitoringDetailMapper[key]}</span>: {objKey}
        </div>
      );
    }
  });
}
