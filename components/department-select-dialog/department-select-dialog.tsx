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
import { DepartmentAccordion } from './department-accordion';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useEffect, useState } from 'react';
import { UserFormData } from '@/lib/form-validation-schemas/user-form-schema';
import { Button } from '../ui/button';
import {
  getDivisionById,
  getDivisionHierarchies
  // getDivisionsByTitle
} from '@/app/actions/server/division-hierarchies';
import {
  // DivisionHierarchyNodeWithNodes,
  DivisionHierarchyWithNodes
} from '@/core/division-hierarchy/types';
import { DivisionHierarchyNode } from '@prisma/client';
import React from 'react';
// import { DivisionHierarchyNode } from '@prisma/client';

type Props = {
  divisionId: string | null;
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
  // const [inputValue, setInputValue] = useState('');
  // const [searchRes, setSearchRes] = useState<DivisionHierarchyNode[]>([]);

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
      // console.log('🚀 ~ useEffect ~ res:', res);
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
        {/* <form
          className='flex w-full items-center space-x-2'
          onSubmit={async (e) => {
            e.preventDefault();
            console.log('e:', e, e.target[0].value);
            const res = await getDivisionsByTitle(e.target[0].value);
            console.log('🚀 ~ onSubmit={ ~ res:', res);
            setSearchRes(res || []);
          }}
        >
          <Input
            type=''
            placeholder='введите название отдела'
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
          <Button type='submit'>Найти</Button>
        </form>
        {searchRes.length && (
          <ul>
            {searchRes.map((item) => (
              <li key={item.id}>- {item.titleLn}</li>
            ))}
          </ul>
        )}
        или выберите из списка */}
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
