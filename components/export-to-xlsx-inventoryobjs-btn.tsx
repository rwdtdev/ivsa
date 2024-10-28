'use client';
import { Upload } from 'lucide-react';
import { Button } from './ui/button';
import { useParams } from 'next/navigation';
import { getAllInventoryObjectsByInventoryIdAction } from '@/app/actions/server/inventoryObjects';
import { exportInventoryObjectsToXlsx } from '@/lib/exportInventoryObjectsToXlsx';

export function ExportToXlsxInventoryObjsBtn() {
  const { inventoryId }: { inventoryId: string } = useParams();
  return (
    <Button
      variant='outline'
      size='sm'
      className='h-8'
      onClick={async () => {
        const res = await getAllInventoryObjectsByInventoryIdAction(inventoryId);
        await exportInventoryObjectsToXlsx(res);
      }}
    >
      <Upload size={20} stroke='slategrey' />
    </Button>
  );
}
