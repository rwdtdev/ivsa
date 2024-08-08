import { ColumnDef } from '@tanstack/react-table';
import { SystemEventObject } from './index';
import {
  systemEventDetailKeys,
  systemEventType
} from '@/constants/mappings/system-event-table-names';
import { format } from 'date-fns';

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
      header: () => <div>Время</div>,
      cell: ({ row }) => (
        <div>
          {format(row.original.actionAt, 'dd.MM.yyyy')}{' '}
          {format(row.original.actionAt, 'HH:mm')}
        </div>
      )
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
        const key = row.original.actionType as keyof typeof systemEventType;
        return <div>{systemEventType[key]}</div>;
      }
    },
    {
      id: 'details',
      accessorKey: 'details',
      header: () => <div>Подробности</div>,
      // cell: ({ row }) => <div>{JSON.stringify(row.original.details, null, 1)}</div>
      cell: ({ row }) => objToHtml(row.original.details)
      // cell: ({ row }) =>
      //   Object.entries(row.original.details).reduce((str, [key, val]) => {
      //     return `${str} +\r\n${key}::${val}\r\n`;
      //   }, `z`)
    }
  ];
}

function objToHtml(obj: ObjectType) {
  const keys = Object.keys(obj) as Array<keyof typeof systemEventDetailKeys>;
  return keys.map((key, i) => {
    if (typeof obj[key] === 'object') {
      return (
        <div key={i} className='pl-4'>
          <span className='font-bold'>{systemEventDetailKeys[key]}</span>:{' '}
          {objToHtml(obj[key])}
        </div>
      );
    } else {
      return (
        <div key={obj[key]} className='py-0.5 pl-4'>
          <span className='font-semibold'>{systemEventDetailKeys[key]}</span>: {obj[key]}
        </div>
      );
    }
  });
}
