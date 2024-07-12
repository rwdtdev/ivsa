'use client';
import { Button } from '@/components/ui/button';

import InventoryAddressForm from './forms/inventory-address-form';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';
import { useState } from 'react';
import useSWR from 'swr';
import { Loader2 } from 'lucide-react';

type Props = {
  locatorIvaLink: { locatorIvaStart: string; locatorStop: string };
  inventoryId: string;
};

export default function IvaLocatorBtn({ locatorIvaLink, inventoryId }: Props) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { locatorIvaStart, locatorStop } = locatorIvaLink;

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, isLoading, isValidating } = useSWR(
    `/api/isinventorylocatorworking/${inventoryId}`,
    fetcher,
    { revalidateOnFocus: true }
  );

  return (
    <>
      {isLoading || isValidating ? (
        <Button disabled className='mb-4 w-full rounded-xl py-6'>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
        </Button>
      ) : data ? (
        data.isLocatorWorking ? (
          <Button className='mb-4 w-full rounded-xl py-6' variant='destructive'>
            <a href={locatorStop}>Остановить сбор гео-данных</a>
          </Button>
        ) : null
      ) : (
        <div>ошибка проверки работы сервиса сбора данных</div>
      )}

      <Drawer
        onClose={() => {
          setIsDrawerOpen(false);
        }}
        open={isDrawerOpen}
      >
        <Button
          className='w-full rounded-xl py-8 shadow-lg'
          onClick={() => {
            console.log('open plz!');
            setIsDrawerOpen(true);
          }}
        >
          Запустить сбор гео-данных <br /> и перейти в видео-конференцию
        </Button>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Укажите адрес объекта</DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>

          <InventoryAddressForm
            locatorIvaStart={locatorIvaStart}
            setIsDrawerOpen={setIsDrawerOpen}
          />

          <DrawerFooter className='flex-row pb-8 pt-0'>
            <Button
              variant='outline'
              className='grow'
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              Отмена
            </Button>
            <Button form='inventory-address-form' className='grow'>
              Подтвердить
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
