'use client';
import { Printer } from 'lucide-react';
import { Button } from './ui/button';

export function PrintBtn() {
  return (
    <Button
      variant='outline'
      size='sm'
      className='h-8'
      onClick={async () => {
        const printJS = await import('print-js');
        printJS.default({
          printable: 'data-table',
          type: 'html',
          style: `td {border: 1px solid; padding: 7px;} table {border-collapse: collapse; }`
          //   header: `<div style="font-size:16px; font-weight:bold;">Журнал событий</div>`,
          //   header: `Журнал событий`
          //   headerStyle: 'font-weight: bold',
          //   documentTitle: 'Журнал событий'
        });
      }}
    >
      <Printer size={20} stroke='slategrey' />
    </Button>
  );
}
