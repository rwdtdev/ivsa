import { getInventoryById } from '@/app/actions/server/getInventoryById';
import { getInventoryLocationsStatsAction } from '@/app/actions/server/inventory-locations';
import InventoryAddressForm from '@/components/forms/inventory-address-form';
import { IvaChairmanDialogBtn } from '@/components/iva-chairmen-dialog-btn';
import IvaLocatorBtn from '@/components/iva-locator-btn';
import MetadataStatistic from '@/components/metadata-statistic';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { P } from '@/components/ui/typography/p';
import { DATE_FORMAT } from '@/constants/date';
import { authConfig } from '@/lib/auth-options';
import { SearchParams } from '@/types';
import moment from 'moment';
import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';

export const metadata = {
  title: 'Опись инвентаризации'
};

interface Props {
  params: {
    eventId: string;
    inventoryId: string;
  };
  searchParams: SearchParams;
}

export default async function InventoryPage({ params: { inventoryId } }: Props) {
  const session = await getServerSession(authConfig);
  const isUserChairman = session?.user.role === 'CHAIRMAN';
  const ua = headers().get('user-agent');
  const isAndroid = /android/i.test(ua || '');
  const inventory = await getInventoryById(inventoryId);
  const locationsStatistics = await getInventoryLocationsStatsAction(inventoryId);

  if (!inventory) {
    return <CardContent>Нет такой инвентаризации!!</CardContent>;
  }
  const locatorIvaLink = {
    locatorIvaStart: `${process.env.MOBILE_BASE_URL}/start?inventoryId=${inventoryId}&appKey=${process.env.LOCATION_RECORDER_APP_KEY}`,
    locatorStop: `${process.env.MOBILE_BASE_URL}/stop?appKey=${process.env.LOCATION_RECORDER_APP_KEY}`
  };

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3'>
      <Card className='flex grow flex-col pb-4 pt-3 sm:grow-0 col-span-1 sm:col-span-2 md:cols-span-1 lg:col-span-2 2xl:col-span-2'>
        <CardContent className='flex grow flex-col'>
          <P className='text-sm'>
            <span className='font-semibold'>Название:</span> {inventory.name}
          </P>
          <P className='text-sm'>
            <span className='font-semibold'>Краткое название:</span> {inventory.shortName}
          </P>
          <P className='text-sm'>
            <span className='font-semibold'>Дата:</span>{' '}
            {moment(inventory.date).format(DATE_FORMAT)}
          </P>
          <P className='text-sm'>
            <span className='font-semibold'>Номер:</span> {inventory.number}
          </P>
          <P className='text-sm'>
            <span className='font-semibold'>Код:</span> {inventory.code}
          </P>
          {!isUserChairman ? (
            <P className='mb-6 text-sm'>
              <span className='font-semibold'>Адрес:</span>{' '}
              {inventory.address ? inventory.address : 'не указан'}
            </P>
          ) : (
            <InventoryAddressForm inventory={inventory} />
          )}
          <div className='mt-auto sm:mt-4'>
            {isAndroid ? (
              <IvaLocatorBtn locatorIvaLink={locatorIvaLink} />
            ) : !inventory.auditRoomInviteLink ? (
              <span className='border-grey-600 rounded-md border p-2'>
                ссылка на видео-конференцию отсутствует
              </span>
            ) : isUserChairman ? (
              <IvaChairmanDialogBtn auditRoomInviteLink={inventory.auditRoomInviteLink} />
            ) : (
              <Button>
                <a href={inventory.auditRoomInviteLink} target='_blank'>
                  Перейти в видео-конференцию
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      <Card className='flex grow flex-col pb-4 pt-3 sm:grow-0 col-span-1 sm:col-span-2 md:cols-span-1 lg:col-span-1 2xl:col-span-1'>
        <CardContent className='flex grow flex-col'>
          <MetadataStatistic data={locationsStatistics} />
        </CardContent>
      </Card>
    </div>
  );
}
