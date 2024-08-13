import { ColumnDef, HeaderContext } from '@tanstack/react-table';
import { SystemEventObject } from './index';
import { systemEventTypes } from '@/constants/mappings/system-event-table-names';
import { format } from 'date-fns';
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header';
import { DataTableFilterableColumn } from '@/types';

import { actionTypeSerializeSchema, actionTypesMapper } from '@/constants/actions';
import { ActionType } from '@prisma/client';

export function fetchSystemEventsTableColumns(): ColumnDef<SystemEventObject, unknown>[] {
  return [
    {
      id: 'id',
      accessorKey: 'id',
      enableHiding: false
    },
    {
      id: 'actionAt',
      accessorKey: 'actionAt',
      header: ({ column }: HeaderContext<SystemEventObject, unknown>) => (
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
      id: 'name',
      accessorKey: 'name',
      header: () => <div>ФИО</div>
    },
    {
      id: 'actionType',
      accessorKey: 'actionType',
      header: () => <div>Событие</div>,
      cell: ({ row }) => {
        const key = row.original.actionType;
        return actionTypesMapper[key];
      }
    },
    {
      id: 'details',
      accessorKey: 'details',
      header: () => <div className='pl-4'>Подробности</div>,
      // cell: ({ row }) => objToHtml(row.original.details)
      cell: ({ row }) =>
        mapToTanstackDetailsCell(row.original.actionType, row.original.details)
    }
  ];
}

export const mapToTanstackDetailsCell = (
  actionType: ActionType,
  details: Record<string, any> | null = null
) => {
  if (!details) return;

  const detailsKeys = Object.keys(details);

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
                : {details[subKey]}
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

export const filterableColumns = (): DataTableFilterableColumn<SystemEventObject>[] => {
  const keys = Object.keys(systemEventTypes) as Array<keyof typeof systemEventTypes>;
  return [
    {
      id: 'actionType',
      title: 'Событие',
      options: keys.map((eventType) => {
        return {
          label: systemEventTypes[eventType],
          value: eventType
        };
      })
    }
  ];
};

// function objToHtml(obj: ObjectType) {
//   const keys = Object.keys(obj) as Array<keyof typeof systemEventDetailKeys>;
//   return keys.map((key, i) => {
//     const objKey = obj[key];
//     if (typeof objKey === 'object') {
//       return (
//         <div key={i} className='pl-4'>
//           <span className='font-bold'>{systemEventDetailKeys[key]}</span>:{' '}
//           {objToHtml(objKey)}
//         </div>
//       );
//     } else {
//       return (
//         <div key={objKey} className='py-0.5 pl-4'>
//           <span className='font-semibold'>{systemEventDetailKeys[key]}</span>: {objKey}
//         </div>
//       );
//     }
//   });
// }
