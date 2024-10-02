'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Accordion } from './departmentAccordion';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useEffect } from 'react';
import { UserFormData } from '@/lib/form-validation-schemas/user-form-schema';

type Props = {
  departmentId?: string;
  /* eslint-disable no-unused-vars */
  setDepartmentId: (key: keyof UserFormData, value: string) => void;
};

export default function DepartmentSelectDialog({ departmentId, setDepartmentId }: Props) {
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/division-hierarchies').then((res2) => res2.json());
      // const res = fakeDepartmentData;
      console.log('🚀 ~ useEffect ~ res:', res);
    })();
  }, []);

  return (
    <Dialog>
      <DialogTrigger className='rounded-md border px-3 py-2 text-start text-sm'>
        {departmentId ? departmentId : 'Выберите отдел'}
      </DialogTrigger>
      <DialogContent className='flex h-[95%] max-w-2xl flex-col'>
        <DialogHeader>
          <DialogTitle>{departmentId ? departmentId : 'Выберите отдел'}</DialogTitle>
          <DialogDescription>
            {/* This action cannot be undone. This will permanently delete your account and
            remove your data from our servers. */}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='h-full'>
          <Accordion departmentId={departmentId} setDepartmentId={setDepartmentId} />
          <ScrollBar orientation='vertical' />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
