'use client';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { hoursSet, minutesSet } from '@/constants/time';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { setTimeOnVideo, updTimeOnVideo } from '@/app/actions/server/inventoryObjects';
import { Inventory, InventoryStatus } from '@prisma/client';
import { useState } from 'react';

type Props = {
  id: string;
  dateTime: Date | null;
  inventory: Inventory;
  userId: string | undefined;
};

export function TimeOnVideoCell({ id, dateTime, inventory, userId }: Props) {
  const [selectedTime, setSelectedTime] = useState(() => {
    if (dateTime) {
      const hours =
        dateTime?.getHours() < 10
          ? '0' + String(dateTime?.getHours())
          : String(dateTime?.getHours());
      const minutes =
        dateTime?.getMinutes() < 10
          ? '0' + String(dateTime?.getMinutes())
          : String(dateTime?.getMinutes());
      return { hours, minutes };
    } else {
      return { hours: '00', minutes: '00' };
    }
  });
  const dpData = dateTime ? format(dateTime, ' HH:mm') : '--:--';

  if (
    inventory.status !== InventoryStatus.AVAILABLE ||
    userId !== inventory.inspectorId
  ) {
    return <div className='text-center'>{dpData}</div>;
  } else if (dateTime) {
    const hours =
      dateTime?.getHours() < 10
        ? '0' + String(dateTime?.getHours())
        : String(dateTime?.getHours());
    const minutes =
      dateTime?.getMinutes() < 10
        ? '0' + String(dateTime?.getMinutes())
        : String(dateTime?.getMinutes());
    return (
      <div className='flex'>
        <Popover>
          <PopoverTrigger className='mx-auto'>
            {hours}:{minutes}
          </PopoverTrigger>
          <PopoverContent className='grid w-40 grid-cols-2'>
            <div className='font-bold'>часы</div>
            <div className='font-bold'>минуты</div>
            <ScrollArea className='h-72 w-16 pl-1 pt-2' key={1}>
              {hoursSet.map((hour) => (
                <div
                  key={hour}
                  className={`ml-1 w-8 border-b p-2 text-sm hover:bg-slate-100 ${hour === selectedTime.hours && 'outline outline-red-600'}`}
                  onClick={() => {
                    setSelectedTime({ ...selectedTime, hours: hour });
                  }}
                >
                  {hour}
                </div>
              ))}
            </ScrollArea>
            <ScrollArea className='h-72 w-16 pl-4 pt-2' key={2}>
              {minutesSet.map((min) => (
                <div
                  key={min}
                  className={`ml-1 w-8 border-b p-2 text-sm hover:bg-slate-100 ${min === selectedTime.minutes && 'outline outline-red-600'}`}
                  onClick={() => {
                    setSelectedTime({ ...selectedTime, minutes: min });
                  }}
                >
                  {min}
                </div>
              ))}
            </ScrollArea>
            <PopoverClose asChild>
              <Button
                className='col-span-2'
                onClick={() => {
                  console.log('selectedTime:', selectedTime);
                  updTimeOnVideo({ id, ...selectedTime });
                }}
              >
                Применить
              </Button>
            </PopoverClose>
          </PopoverContent>
        </Popover>
      </div>
    );
  } else {
    return (
      <>
        <Button
          className='h-7 w-full text-nowrap'
          onClick={async () => {
            setTimeOnVideo(id);
          }}
        >
          {dpData}
        </Button>
      </>
    );
  }
}
