'use client';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header';
import { Inventory, InventoryObject } from '@prisma/client';
import {
  InventoryObjectsTableColumnNames,
  makeColumnsNames
} from '@/constants/mappings/tables-column-names';
import { InventoryCode } from '@/core/inventory/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
// import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  // setTimeOnVideo,
  updComments,
  updIsConditionOk
} from '@/app/actions/server/inventoryObjects';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { TimeOnVideoCell } from './TimeOnVideoCell';
import { VideosDateCell } from './VideosDateCell';

const padding = 0;

const getColumnNameById = makeColumnsNames(InventoryObjectsTableColumnNames);

export function fetchInventoryObjectsTableColumnDefs(
  inventory: Inventory,
  userId: string | undefined
): ColumnDef<InventoryObject, unknown>[] {
  const columns: ColumnDef<InventoryObject, unknown>[] = [
    {
      id: 'inventoryNumber',
      accessorKey: 'inventoryNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={getColumnNameById(column.id)} />
      ),
      cell: ({ row }) => {
        return <div style={{ padding }}>{row.original.inventoryNumber}</div>;
      }
    },
    {
      id: 'location',
      accessorKey: 'location',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={getColumnNameById(column.id)} />
      ),
      cell: ({ row }) => {
        return <div style={{ padding }}>{row.original.location}</div>;
      }
    },
    {
      id: 'serialNumber',
      accessorKey: 'serialNumber',
      // enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={getColumnNameById(column.id)} />
      ),
      cell: ({ row }) => {
        return <div style={{ padding }}>{row.original.serialNumber}</div>;
      }
    },
    {
      id: 'networkNumber',
      accessorKey: 'networkNumber',
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={getColumnNameById(column.id)} />
      ),
      cell: ({ row }) => {
        return <div style={{ padding }}>{row.original.networkNumber}</div>;
      }
    },
    {
      id: 'passportNumber',
      accessorKey: 'passportNumber',
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={getColumnNameById(column.id)} />
      ),
      cell: ({ row }) => {
        return <div style={{ padding }}>{row.original.passportNumber}</div>;
      }
    },
    {
      id: 'quantity',
      accessorKey: 'quantity',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={getColumnNameById(column.id)} />
      ),
      cell: ({ row }) => {
        return (
          <div style={{ padding }}>
            {row.original.quantity} {row.original.unitName}.
          </div>
        );
      }
    },
    {
      id: 'state',
      accessorKey: 'state',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={getColumnNameById(column.id)} />
      ),
      cell: ({ row }) => {
        return <div style={{ padding }}>{row.original.state}</div>;
      }
    },
    {
      id: 'name',
      accessorKey: 'name',
      enableResizing: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={getColumnNameById(column.id)} />
      ),
      cell: ({ row }) => {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  style={{
                    padding,
                    overflowX: 'hidden',
                    textWrap: 'nowrap',
                    maxWidth: 300
                  }}
                >
                  {row.original.name}
                </div>
              </TooltipTrigger>
              <TooltipContent side='top' align='end'>
                <p> {row.original.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
    },
    {
      id: 'batchNumber',
      accessorKey: 'batchNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={getColumnNameById(column.id)} />
      ),
      cell: ({ row }) => {
        return <div style={{ padding }}>{row.original.batchNumber}</div>;
      }
    },
    {
      id: 'placement',
      accessorKey: 'placement',
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={getColumnNameById(column.id)} />
      ),
      cell: ({ row }) => {
        return (
          <div style={{ padding, textWrap: 'nowrap' }}>{row.original.placement}</div>
        );
      }
    },
    {
      id: 'videosDate',
      accessorKey: 'videosDate',
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={getColumnNameById(column.id)} />
      ),
      cell: ({ row }) => (
        <VideosDateCell
          id={row.original.id}
          dateTime={row.original.onVideoAt}
          inventory={inventory}
          userId={userId}
        />
      )
      //   {
      //   const dpData = row.original.onVideoAt
      //     ? format(row.original.onVideoAt, 'dd.MM.yyyy ')
      //     : '--.--.----';
      //   if (inventory.isProcessed) {
      //     return <div className='text-center'>{dpData}</div>;
      //   } else {
      //     return (
      //       <Button
      //         className='h-7 w-full text-nowrap'
      //         onClick={async () => {
      //           setTimeOnVideo(row.original.id);
      //         }}
      //       >
      //         {dpData}
      //       </Button>
      //     );
      //   }
      // }
    },
    {
      id: 'onVideoAt',
      accessorKey: 'onVideoAt',
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={getColumnNameById(column.id)} />
      ),
      cell: ({ row }) => (
        <TimeOnVideoCell
          id={row.original.id}
          dateTime={row.original.onVideoAt}
          inventory={inventory}
          userId={userId}
        />
      )
    },
    //   {
    //   const dpData = row.original.onVideoAt
    //     ? format(row.original.onVideoAt, ' HH:mm')
    //     : '--:--';

    //   if (inventory.isProcessed) {
    //     return <div className='text-center'>{dpData}</div>;
    //   } else if (row.original.onVideoAt) {
    //     const hours =
    //       row.original.onVideoAt?.getHours() < 10
    //         ? '0' + String(row.original.onVideoAt?.getHours())
    //         : String(row.original.onVideoAt?.getHours());
    //     const minutes =
    //       row.original.onVideoAt?.getMinutes() < 10
    //         ? '0' + String(row.original.onVideoAt?.getMinutes())
    //         : String(row.original.onVideoAt?.getMinutes());
    //     return (
    //       <>
    //         {/* <input
    //           type='time'
    //           id='time'
    //           className='block w-12 p-2.5 text-sm leading-none text-gray-900 focus:ring-blue-500'
    //           value={`${hours}:${minutes}`}
    //           // value={`5:13`}
    //           onChange={(e) => {
    //             console.log('e:', e);
    //           }}
    //           required
    //         /> */}
    //         {/* {hours}:{minutes} */}
    //         <Popover>
    //           <PopoverTrigger>
    //             {hours}:{minutes}
    //           </PopoverTrigger>
    //           <PopoverContent className='grid w-40 grid-cols-2'>
    //             <div className='font-bold'>часы</div>
    //             <div className='font-bold'>минуты</div>
    //             <ScrollArea className='h-72 w-16 pl-1 pt-2'>
    //               {hoursSet.map((hour) => (
    //                 <>
    //                   <div
    //                     key={hour}
    //                     className='w-8 border-b p-2 text-sm hover:bg-slate-100'
    //                   >
    //                     {hour}
    //                   </div>
    //                   {/* <Separator className='my-2 w-6' /> */}
    //                 </>
    //               ))}
    //             </ScrollArea>
    //             <ScrollArea className='h-72 w-16 pl-4 pt-2'>
    //               {minutesSet.map((min) => (
    //                 <>
    //                   <div
    //                     key={min}
    //                     className='w-8 border-b p-2 text-sm hover:bg-slate-100'
    //                   >
    //                     {min}
    //                   </div>
    //                   {/* <Separator className='my-2 w-6' /> */}
    //                 </>
    //               ))}
    //             </ScrollArea>
    //             <Button className='col-span-2'>Применить</Button>
    //           </PopoverContent>
    //         </Popover>
    //         {/* :
    //         <Popover>
    //           <PopoverTrigger>{minutes}</PopoverTrigger>
    //           <PopoverContent className='w-20'>
    //             <ScrollArea className='h-72 w-16 rounded-md'>
    //               minutes
    //               {minutesSet.map((tag) => (
    //                 <>
    //                   <div key={tag} className='text-sm'>
    //                     {tag}
    //                   </div>
    //                   <Separator className='my-2' />
    //                 </>
    //               ))}
    //             </ScrollArea>
    //           </PopoverContent>
    //         </Popover> */}
    //       </>
    //     );
    //   } else {
    //     return (
    //       <>
    //         <Button
    //           className='h-7 w-full text-nowrap'
    //           onClick={async () => {
    //             setTimeOnVideo(row.original.id);
    //           }}
    //         >
    //           {dpData}
    //         </Button>
    //         {/* <form className='mx-auto max-w-[8rem]'> */}
    //         {/* <div className='relative'> */}
    //         {/* <div className='pointer-events-none absolute inset-y-0 end-0 top-0 flex items-center pe-3.5'>
    //               <svg
    //                 className='h-4 w-4 text-gray-500 dark:text-gray-400'
    //                 aria-hidden='true'
    //                 xmlns='http://www.w3.org/2000/svg'
    //                 fill='currentColor'
    //                 viewBox='0 0 24 24'
    //               >
    //                 <path
    //                   fillRule='evenodd'
    //                   d='M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z'
    //                   clipRule='evenodd'
    //                 />
    //               </svg>
    //             </div> */}

    //         {/* </div> */}
    //         {/* </form> */}
    //       </>
    //     );
    //   }
    // }
    // },

    {
      id: 'isConditionOk',
      accessorKey: 'isConditionOk',
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={getColumnNameById(column.id)} />
      ),
      cell: ({ row }) => (
        <Select
          value={
            row.original.isConditionOk === null
              ? 'undefined'
              : row.original.isConditionOk
                ? 'isOk'
                : 'isFail'
          }
          onValueChange={async (e) => {
            console.log(e, row.original.id);
            updIsConditionOk(
              row.original.id,
              e === 'undefined' ? null : e === 'isOk' ? true : false
            );
          }}
          disabled={userId !== inventory.inspectorId}
        >
          <SelectTrigger
            className={` ${
              row.original.isConditionOk === null
                ? ''
                : row.original.isConditionOk
                  ? 'bg-green-200'
                  : 'bg-red-200'
            }`}
          >
            <SelectValue placeholder='Theme' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='undefined'>не&nbsp;определено</SelectItem>
            <SelectItem value='isOk'>исправно</SelectItem>
            <SelectItem value='isFail'>неисправно</SelectItem>
          </SelectContent>
        </Select>
      )
    },
    {
      id: 'comments',
      accessorKey: 'comments',
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={getColumnNameById(column.id)} />
      ),
      cell: ({ row }) => (
        <Dialog>
          <DialogTrigger
            asChild
            disabled={!row.original.comments && userId !== inventory.inspectorId}
          >
            <Button variant='outline' className='w-full'>
              {userId !== inventory.inspectorId
                ? row.original.comments
                  ? 'читать'
                  : 'нет комм-в'
                : row.original.comments
                  ? 'редактировать'
                  : 'добавить'}
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[600px]'>
            <DialogHeader>
              {userId === inventory.inspectorId ? (
                <DialogTitle>Добавить комментарий </DialogTitle>
              ) : (
                <DialogTitle>Комментарий </DialogTitle>
              )}
              <DialogDescription>
                {/* Make changes to your profile here. Click save when youre done. */}
                {row.original.name} № {row.original.serialNumber}
              </DialogDescription>
            </DialogHeader>
            {userId === inventory.inspectorId && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  // @ts-expect-error not standard target
                  updComments(row.original.id, e.target[0].value);
                }}
              >
                <Textarea
                  placeholder='Напишите ваш комментарий здесь.'
                  className='mb-5 w-full'
                  defaultValue={row.original.comments || ''}
                  rows={10}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type='submit' variant='outline'>
                      Отмена
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button type='submit'>Сохранить</Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            )}
            {userId !== inventory.inspectorId && (
              <Textarea
                placeholder='Нет комментариев.'
                className='mb-5 w-full'
                defaultValue={row.original.comments || ''}
                rows={10}
                disabled
              />
            )}
          </DialogContent>
        </Dialog>
      )
    }
  ];

  switch (inventory.code as InventoryCode) {
    case InventoryCode.I01A01:
      return columns.filter(({ id }) =>
        [
          'name',
          'location',
          'inventoryNumber',
          'serialNumber',
          'networkNumber',
          'passportNumber',
          'quantity',
          'state',
          'videosDate',
          'onVideoAt',
          'isConditionOk',
          'comments'
        ].includes(id as string)
      );

    // INV-3
    case InventoryCode.I02001:
    case InventoryCode.I02A02:
      return columns.filter(({ id }) =>
        [
          'name',
          'nomenclatureNumber',
          'unitCode',
          'unitName',
          'inventoryNumber',
          'passportNumber',
          'batchNumber',
          'quantity',
          'videosDate',
          'onVideoAt',
          'isConditionOk',
          'comments'
        ].includes(id as string)
      );

    // INV-5
    case InventoryCode.I02F01:
    case InventoryCode.I02F02:
    case InventoryCode.I02F03:
    case InventoryCode.I02F04:
      return columns.filter(({ id }) =>
        [
          'name',
          'nomenclatureNumber',
          'serialNumber',
          'placement',
          'unitCode',
          'unitName',
          'batchNumber',
          'quantity',
          'videosDate',
          'onVideoAt',
          'isConditionOk',
          'comments'
        ].includes(id as string)
      );

    // FNU-49
    case InventoryCode.I01011:
      return columns.filter(({ id }) =>
        [
          'name',
          'nomenclatureNumber',
          'inventoryNumber',
          'serialNumber',
          'quantity',
          'videosDate',
          'onVideoAt',
          'isConditionOk',
          'comments'
        ].includes(id as string)
      );

    // FNU-50
    case InventoryCode.I02G01:
    case InventoryCode.I02G02:
      return columns.filter(({ id }) =>
        [
          'name',
          'nomenclatureNumber',
          'inventoryNumber',
          'serialNumber',
          'unitCode',
          'unitName',
          'quantity',
          'videosDate',
          'onVideoAt',
          'isConditionOk',
          'comments'
        ].includes(id as string)
      );

    // FNU-55
    case InventoryCode.I02011:
    case InventoryCode.I02G11:
    case InventoryCode.I02G22:
      return columns.filter(({ id }) =>
        [
          'name',
          'nomenclatureNumber',
          'unitCode',
          'unitName',
          'batchNumber',
          'quantity',
          'videosDate',
          'onVideoAt',
          'isConditionOk',
          'comments'
        ].includes(id as string)
      );
  }
}
