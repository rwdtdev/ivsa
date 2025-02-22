'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import VideoPlayModal from './videoPlayModal';
import { InventoryResourceWithAddress } from '@/app/actions/server/inventories';
import DownLoadFilesBtn from './downLoadFilesBtn';

const padding = 9;

export function fetchVideosTableColumnDefs(
  inventoryNumber: string,
  isUserChairman: boolean
): ColumnDef<InventoryResourceWithAddress, unknown>[] {
  return [
    {
      id: 'date',
      accessorKey: 'date',
      header: 'Дата',
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
      header: 'Время начала',
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
      header: 'Время окончания',
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
      header: 'Адрес ',
      cell: ({ row }) => <div>{row.original.address} </div>
    },
    {
      id: 'actions',
      accessorKey: 'actions',
      header: 'Действия',
      cell: ({ row }) => (
        <div className='flex'>
          <VideoPlayModal data={row.original} inventoryNumber={inventoryNumber} />
          {isUserChairman && (
            <>
              <div>
                <Separator orientation='vertical' className='mx-4' />
              </div>
              <DownLoadFilesBtn data={row.original} />
            </>
          )}
        </div>
      )
    },
    {
      id: 'isArchived',
      accessorKey: 'isArchived',
      header: 'Место хранения',
      cell: ({ row }) => {
        const isArchived = row.original.isArchived;

        return <div>{isArchived ? 'Архивное хранилище' : 'Оперативное хранилище'}</div>
      }
    }
  ];
}
