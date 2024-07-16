'use client';

import { ColumnDef } from '@tanstack/react-table';
import { InventoryResource } from '@prisma/client';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import VideoPlayModal from './videoPlayModal';
import DownLoad from './downLoad';
import { InventoryResourceWithAddress } from '@/app/actions/server/inventories';

export type VideoView = Omit<InventoryResource, 'startAt' | 'endAt'> & {
  startAt: string;
  endAt: string;
};

const padding = 9;

export function fetchVideosTableColumnDefs(): ColumnDef<
  InventoryResourceWithAddress,
  unknown
>[] {
  return [
    {
      id: 'date',
      accessorKey: 'date',
      header: 'дата',
      cell: ({ row }) =>
        row.original.startAt ? (
          <div style={{ padding }}> {format(row.original.startAt, 'dd.MM.yyyy')}</div>
        ) : (
          <div>---</div>
        )
    },
    {
      id: 'startAt',
      accessorKey: 'startAt',
      header: 'время начала',
      cell: ({ row }) =>
        row.original.startAt ? (
          <div style={{ padding }}>{format(row.original.startAt, 'HH:mm')}</div>
        ) : (
          <div>---</div>
        )
    },
    {
      id: 'endAt',
      accessorKey: 'endAt',
      header: 'время окончания',
      cell: ({ row }) =>
        row.original.endAt ? (
          <div style={{ padding }}>{format(row.original.endAt, 'HH:mm')}</div>
        ) : (
          <div>---</div>
        )
    },
    {
      id: 'address',
      accessorKey: 'address',
      header: 'адрес ',
      cell: ({ row }) => <div>{row.original.address} </div>
    },
    {
      id: 'actions',
      accessorKey: 'actions',
      header: 'действия',
      cell: ({ row }) => (
        <div className='flex'>
          <VideoPlayModal data={row.original} />
          <div>
            <Separator orientation='vertical' className='mx-4' />
          </div>
          <DownLoad data={row.original} />
        </div>
      )
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
