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

type Props = {
  locatorIvaLink: { locatorIvaStart: string; locatorStop: string };
  inventoryId: string;
};

export default function IvaLocatorBtn({ locatorIvaLink, inventoryId }: Props) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isStopBtnTaped, setIsStopBtnTaped] = useState(false);
  const { locatorIvaStart, locatorStop } = locatorIvaLink;

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data } = useSWR(`/api/isinventorylocatorworking/${inventoryId}`, fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 2000
  });

  return (
    <>
      {data &&
        (data.isLocatorWorking === true ||
          (data.isLocatorWorking === undefined && !isStopBtnTaped)) && (
          // ? (
          <Button
            className='mb-4 h-12 w-full rounded-xl p-0'
            variant='destructive'
            onClick={() => {
              setIsStopBtnTaped(true);
            }}
          >
            <a href={locatorStop} className='w-full p-4'>
              Остановить сбор гео-данных
            </a>
          </Button>
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
