'use client';

import { ColumnDef } from '@tanstack/react-table';
import { InventoryResource } from '@prisma/client';
import { format } from 'date-fns';
import { VideoResourcesTest } from '@/app/events/[eventId]/inventories/[inventoryId]/videoslist/page';
import { Separator } from '@/components/ui/separator';
import VideoPlayModal from './videoPlayModal';
import DownLoad from './downLoad';

export type VideoView = Omit<InventoryResource, 'startAt' | 'endAt'> & {
  startAt: string;
  endAt: string;
};

const padding = 9;

// const getColumnNameById = makeColumnsNames(EventsTableColumnNames);

// const defaultHeader = ({ column }: HeaderContext<VideoView, unknown>) => (
//   <DataTableColumnHeader column={column} title={getColumnNameById(column.id)} />
// );

// export function fetchVideosTableColumnDefs(): ColumnDef<InventoryResource, unknown>[] {
export function fetchVideosTableColumnDefs(): ColumnDef<VideoResourcesTest, unknown>[] {
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

// export const filterableColumns = (): DataTableFilterableColumn<EventView>[] => {
//   return [
//     {
//       id: 'status',
//       title: 'Статус',
//       options: [EventStatus.OPEN, EventStatus.CLOSED, EventStatus.REMOVED].map(
//         (status) => {
//           const value = EventStatuses[status];

//           return {
//             label: value[0]?.toUpperCase() + value.slice(1),
//             value: status
//           };
//         }
//       )
//     },
//     {
//       id: 'briefingStatus',
//       title: 'Инструктаж',
//       options: [
//         BriefingStatus.NOT_STARTED,
//         BriefingStatus.IN_PROGRESS,
//         BriefingStatus.PASSED
//       ].map((status) => {
//         const value = BriefingStatuses[status];

//         return {
//           label: value[0]?.toUpperCase() + value.slice(1),
//           value: status
//         };
//       })
//     }
//   ];
// };
