'use client';

import * as React from 'react';
import moment from 'moment';
import _ from 'underscore';
import { ru } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { dateTimeToGMT } from '@/lib/dateTimeToGMT';

export function DatePickerWithRange({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [date, setDate] = useState<DateRange | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const createQueryString = React.useCallback(
    (params: Record<string, string | number | Date | null | undefined>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams]
  );

  function handleOkBtn() {
    setIsCalendarOpen(false);
    let qs = '';
    if (date && !_.isEmpty(date)) {
      const dates: { from?: string; to?: string | null } = {};
      if (date.from) {
        dates.from = date.from.toISOString();
      }
      if (date.to) {
        dates.to = date.to.toISOString();
      } else {
        dates.to = null;
      }
      qs = createQueryString(dates);
    } else {
      qs = createQueryString({ from: null, to: null });
    }

    if (qs.length > 0) {
      router.push(`${pathname}?${qs}`, { scroll: false });
    } else {
      router.push(pathname);
    }
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant={'outline'}
            className={cn(
              'h-8 w-[240px] justify-start text-left font-normal',
              !date && 'text-muted-foreground',
              className
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {date?.from ? (
              date.to ? (
                <>
                  {moment(date.from).locale('ru').format('DD.MM.YYYY')} -{' '}
                  {moment(date.to).locale('ru').format('DD.MM.YYYY')}
                </>
              ) : (
                moment(date.from).locale('ru').format('DD.MM.YYYY')
              )
            ) : (
              <span>Выбрать период</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            initialFocus
            mode='range'
            defaultMonth={date?.from}
            selected={date}
            onSelect={(e) => {
              setDate({ from: dateTimeToGMT(e?.from), to: dateTimeToGMT(e?.to) });
            }}
            numberOfMonths={2}
            locale={ru}
          />
          <div className='flex justify-end p-5'>
            <Button
              className='mr-5'
              onClick={() => {
                setDate(undefined);
              }}
            >
              Очистить
            </Button>
            <Button onClick={handleOkBtn}>Ок</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
