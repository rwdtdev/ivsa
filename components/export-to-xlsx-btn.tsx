'use client';
import { Upload } from 'lucide-react';
import { Button } from './ui/button';
import { getAllMonitoringData } from '@/app/actions/server/getAllMonitoringData';
import { exportMonitoringToXlsx } from '@/lib/exportMonitoringToXlsx';

export function ExportToXlsxBtn() {
  return (
    <Button
      variant='outline'
      size='sm'
      className='h-8'
      onClick={async () => {
        try {
          const res = await getAllMonitoringData();
          if (!res) throw new Error('no monitoring data');
          exportMonitoringToXlsx(res);
        } catch (err) {
          console.log(err);
        }
      }}
    >
      <Upload size={20} stroke='slategrey' />
    </Button>
  );
}
