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
import { useEffect, useState } from 'react';
import { UserFormData } from '@/lib/form-validation-schemas/user-form-schema';
import { Button } from '../ui/button';
import {
  getDivisionById,
  getDivisionHierarchies
} from '@/app/actions/server/division-hierarchies';
import {
  // DivisionHierarchyNodeWithNodes,
  DivisionHierarchyWithNodes
} from '@/core/division-hierarchy/types';
import { DivisionHierarchyNode } from '@prisma/client';
// import { DivisionHierarchyNode } from '@prisma/client';

type Props = {
  divisionId?: string;
  /* eslint-disable no-unused-vars */
  formSetDepartmentId: (
    key: keyof UserFormData,
    value: string,
    { shouldDirty }: { shouldDirty: boolean }
  ) => void;
};

export default function DepartmentSelectDialog({
  divisionId,
  formSetDepartmentId
}: Props) {
  const [divisionsData, setDivisionsData] = useState<DivisionHierarchyWithNodes[]>([]);

  const [division, setDivision] = useState<DivisionHierarchyNode | null>(null);

  useEffect(() => {
    (async () => {
      if (divisionId) {
        const res = await getDivisionById(divisionId);
        console.log('🚀 ~ division:', res);
        setDivision(res);
      }
    })();
  }, [divisionId]);

  useEffect(() => {
    (async () => {
      const res = await getDivisionHierarchies();
      console.log('🚀 ~ useEffect ~ res:', res);
      setDivisionsData(res);
    })();
  }, []);

  return (
    <Dialog>
      <DialogTrigger className='rounded-md border px-3 py-2 text-start text-sm shadow-sm'>
        {division ? division.titleSh : 'Выберите отдел'}
      </DialogTrigger>
      <DialogContent className='flex h-[95%] max-w-2xl flex-col'>
        <DialogHeader>
          <DialogTitle>{division ? division.titleSh : 'Выберите отдел'}</DialogTitle>
          <DialogDescription></DialogDescription>
          {/* без DialogDescription консоль браузера сыплет ошибки */}
        </DialogHeader>
        <ScrollArea className='h-full'>
          {divisionsData.length
            ? divisionsData.map((item) => (
                <DepartmentAccordion
                  key={item.id}
                  divisionId={divisionId}
                  formSetDepartmentId={formSetDepartmentId}
                  divisionsData={item.nodes}
                />
              ))
            : 'данные загружаются...'}
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
