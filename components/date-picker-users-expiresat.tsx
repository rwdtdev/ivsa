'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ru } from 'date-fns/locale';
import { useState } from 'react';
import type { Table } from '@tanstack/react-table';
import { updateUsersExpiresAt } from '@/app/actions/server/update-users-expiresat';
import { ConfirmModalDialogToolbarBtn } from './modal/confirm-modal-dialog-toolbar-btn';
import { dateTimeToGMT } from '@/lib/dateTimeToGMT';

interface Props<TData> {
  table: Table<TData>;
}

export function DatePickerUsersExpiresAt<TData>({ table }: Props<TData>) {
  const [date, setDate] = useState<Date>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  function updSelectedUsersExpiresAt() {
    if (date) {
      const selectedUsersObj = table.getState().rowSelection;
      const usersIds: string[] = Object.keys(selectedUsersObj);
      updateUsersExpiresAt(usersIds, date);
    }
    table.resetRowSelection();
  }

  return (
    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size={'sm'}
          className={cn(
            'w-[240px] justify-start bg-gray-100 text-left',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? (
            format(date, 'dd.MM.yyyy')
          ) : (
            <span className='text-black'>Срок действия учетной записи</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          selected={date}
          onSelect={(e) => {
            setDate(dateTimeToGMT(e));
          }}
          initialFocus
          locale={ru}
        />
        <div className='flex justify-end px-4 pb-4'>
          <Button
            size='sm'
            className={date && 'mr-4'}
            onClick={() => {
              setDate(undefined);
              setIsCalendarOpen(false);
            }}
          >
            Отмена
          </Button>
          {date && (
            <ConfirmModalDialogToolbarBtn
              btnText='Ок'
              title='Изменить срок действия учетной записи?'
              msg={`Данное действие изменит срок действия выбранных учетных записей на ${format(date, 'dd.MM.yyyy')}`}
              ariaLabel='кнопка подтверждения выбора даты срока действия учетной записи'
              variant='default'
              size='sm'
              action={updSelectedUsersExpiresAt}
            />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
