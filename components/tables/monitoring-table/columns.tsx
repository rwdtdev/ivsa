import { ColumnDef, HeaderContext } from '@tanstack/react-table';
// import { SystemEventObject } from './index';
import {
  systemEventDetailKeys /* ,
  systemEventTypes */
} from '@/constants/mappings/system-event-table-names';
import { format } from 'date-fns';
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header';
import { DataTableFilterableColumn } from '@/types';

import {
  actionStatusesMapper,
  actionTypeSerializeSchema,
  actionTypesMapper
} from '@/constants/actions';
import { Action, ActionStatus, ActionType } from '@prisma/client';
import { JsonObject, JsonValue } from '@prisma/client/runtime/library';

// type ObjectType = {
//   [k: string]: string | ObjectType;
// };

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

      // cell: ({ row }) => mapToTanstackDetailsCell(row.original.type, row.original.details)
    }
  ];
}

export const mapToTanstackDetailsCell = (
  actionType: ActionType,
  // details: Record<string, any> | null = null
  details: JsonValue
) => {
  if (!details) return;
  if (
    typeof details === 'string' ||
    typeof details === 'number' ||
    typeof details === 'boolean'
  )
    return;

  const detailsModTypes = details as Record<string, any>;

  const detailsKeys = Object.keys(detailsModTypes);

  if (detailsKeys.length === 0) return;

  const schema = actionTypeSerializeSchema[actionType];

  if (!schema) return;

  // return Object.entries(schema).map(([_, value]) => {
  return Object.values(schema).map((value) => {
    return (
      <div key={value.key}>
        <span className='font-bold'>{value.key}</span>
        <ul>
          {Object.keys(value.subKeys).map((subKey) => {
            return (
              <li key={subKey} className='text-nowrap'>
                <span className='pl-2 font-semibold'>
                  {(value.subKeys as { [key: string]: string })[subKey]}
                </span>
                : {detailsModTypes[subKey]}
              </li>
            );
          })}
        </ul>
      </div>
    );
  });
};

export const monitoringDatePickers = [
  {
    ids: 'actionAt',
    type: 'range',
    title: 'Период'
  }
];

export const filterableColumns = (): DataTableFilterableColumn<Action>[] => {
  // const keys = Object.keys(systemEventTypes) as Array<keyof typeof systemEventTypes>;
  // const actionStatuses = Object.values(ActionStatus);
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
  const obj = obj2 as JsonObject;
  const keys = Object.keys(obj) as Array<keyof typeof systemEventDetailKeys>;
  return keys.map((key, i) => {
    const objKey = obj[key];
    if (typeof objKey === 'object') {
      return (
        <div key={i} className='pl-4'>
          <span className='font-bold'>{systemEventDetailKeys[key]}</span>:{' '}
          {objToHtml(objKey)}
        </div>
      );
    } else {
      return (
        <div key={i + String(objKey)} className='py-0.5 pl-4'>
          <span className='font-semibold'>{systemEventDetailKeys[key]}</span>: {objKey}
        </div>
      );
    }
  });
}
