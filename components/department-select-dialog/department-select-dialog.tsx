'use client';
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
import { DepartmentAccordion } from './departmentAccordion';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useEffect } from 'react';
import { UserFormData } from '@/lib/form-validation-schemas/user-form-schema';
import { Button } from '../ui/button';

type Props = {
  departmentId?: string;
  /* eslint-disable no-unused-vars */
  setDepartmentId: (
    key: keyof UserFormData,
    value: string,
    { shouldDirty }: { shouldDirty: boolean }
  ) => void;
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
      <DialogTrigger className='rounded-md border px-3 py-2 text-start text-sm shadow-sm'>
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
          <DepartmentAccordion
            departmentId={departmentId}
            setDepartmentId={setDepartmentId}
          />
          <ScrollBar orientation='vertical' />
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button type='button'>Закрыть</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
