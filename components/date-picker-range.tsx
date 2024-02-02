'use client';

import * as React from 'react';
import _ from 'underscore';
import { addDays, format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function DatePickerWithRange({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [date, setDate] = React.useState<DateRange | undefined>();

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

  React.useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        ...(date && date.from && { from: date.from.toISOString() }),
        ...(date && date.to && { to: date.to.toISOString() })
      })}`,
      {
        scroll: false
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant={'outline'}
            className={cn(
              'w-[240px] justify-start text-left font-normal',
              !date && 'text-muted-foreground',
              className
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'dd.mm.yyyy', { locale: ru })} -{' '}
                  {format(date.to, 'dd.mm.yyyy', { locale: ru })}
                </>
              ) : (
                format(date.from, 'dd.mm.yyyy', { locale: ru })
              )
            ) : (
              <span>Выбрать</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            initialFocus
            mode='range'
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            locale={ru}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
