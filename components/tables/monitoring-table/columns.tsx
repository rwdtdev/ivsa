import { ColumnDef, HeaderContext } from '@tanstack/react-table';
import { SystemEventObject } from './index';
import {
  systemEventDetailKeys,
  systemEventTypes
} from '@/constants/mappings/system-event-table-names';
import { format } from 'date-fns';
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header';
import { DataTableFilterableColumn } from '@/types';

type ObjectType = {
  [k: string]: string | ObjectType;
};

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
      // header: () => <div>Дата{'\u00A0\u00A0\u00A0'} Время</div>,
      header: ({ column }: HeaderContext<SystemEventObject, unknown>) => (
        <DataTableColumnHeader column={column} title='Дата&nbsp;&nbsp;Время' />
      ),
      cell: ({ row }) =>
        // <div className='pl-2'>
        format(row.original.actionAt, 'dd.MM.yyyy') +
        '\u00A0' +
        format(row.original.actionAt, 'HH:mm')
      // </div>
    },
    // {
    //   id: 'time',
    //   accessorKey: 'time',
    //   header: () => <div>Время</div>,
    //   cell: ({ row }) => <div>{row.original.actionAt}</div>
    // },
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
        const key = row.original.actionType as keyof typeof systemEventTypes;
        return systemEventTypes[key];
      }
    },
    {
      id: 'details',
      accessorKey: 'details',
      header: () => <div className='pl-4'>Подробности</div>,
      // cell: ({ row }) => <div>{JSON.stringify(row.original.details, null, 1)}</div>
      cell: ({ row }) => objToHtml(row.original.details)
      // cell: ({ row }) =>
      //   Object.entries(row.original.details).reduce((str, [key, val]) => {
      //     return `${str} +\r\n${key}::${val}\r\n`;
      //   }, `z`)
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

function objToHtml(obj: ObjectType) {
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
        <div key={objKey} className='py-0.5 pl-4'>
          <span className='font-semibold'>{systemEventDetailKeys[key]}</span>: {objKey}
        </div>
      );
    }
  });
}
