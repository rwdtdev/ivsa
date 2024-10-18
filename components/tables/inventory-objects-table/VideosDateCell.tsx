'use client';
import { setTimeOnVideo, updVideosDate } from '@/app/actions/server/inventoryObjects';
import { Button } from '@/components/ui/button';
import { Inventory, InventoryStatus } from '@prisma/client';
import { format } from 'date-fns';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import { ru } from 'date-fns/locale';
import { dateTimeToGMT } from '@/lib/dateTimeToGMT';

type Props = {
  id: string;
  dateTime: Date | null;
  inventory: Inventory;
  userId: string | undefined;
};

export function VideosDateCell({ id, dateTime, inventory, userId }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    dateTime || undefined
  );
  const dpData = dateTime ? format(dateTime, 'dd.MM.yyyy ') : '--.--.----';
  if (
    inventory.status !== InventoryStatus.AVAILABLE ||
    userId !== inventory.inspectorId
  ) {
    return <div className='text-center'>{dpData}</div>;
  } else if (dateTime) {
    return (
      <Popover>
        <PopoverTrigger className='mx-auto'>
          {format(dateTime, 'dd.MM.yyyy ')}
        </PopoverTrigger>
        <PopoverContent>
          <Calendar
            mode='single'
            locale={ru}
            selected={selectedDate}
            onSelect={setSelectedDate}
          />
          <PopoverClose asChild>
            <div className='flex'>
              <Button
                className='ml-auto'
                onClick={() => {
                  const date = dateTimeToGMT(selectedDate);
                  if (date) updVideosDate({ id, selectedDate: date });
                }}
              >
                Применить
              </Button>
            </div>
          </PopoverClose>
        </PopoverContent>
      </Popover>
    );
  } else {
    return (
      <Button
        className='h-7 w-full text-nowrap'
        onClick={async () => {
          setTimeOnVideo(id);
        }}
      >
        {dpData}
      </Button>
    );
  }
}
