import { getInventoryById } from '@/app/actions/server/getInventoryById';
import IvaLocatorBtn from '@/components/iva-locator-btn';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { P } from '@/components/ui/typography/p';
import { DATE_FORMAT } from '@/constants/date';
import { SearchParams } from '@/types';
import moment from 'moment';
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
  const ua = headers().get('user-agent');
  const isAndroid = /android/i.test(ua || '');
  const inventory = await getInventoryById(inventoryId);

  if (!inventory) {
    return <CardContent>Нет такой инвентаризации!!</CardContent>;
  }
  const locatorIvaLink = {
    locatorIvaStart: `${process.env.MOBILE_BASE_URL}/start?inventoryId=${inventoryId}&appKey=kdKNJipzpskF8DhUchW43iocGdOQpszRQQdyRCMVMA=`,
    locatorStop: `${process.env.MOBILE_BASE_URL}/stop?appKey=kdKNJipzpskF8DhUchW43iocGdOQpszRQQdyRCMVMA=`
  };

  return (
    <>
      <Card className='mb-3 flex grow flex-col pb-4 pt-3 sm:grow-0'>
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
          <P className='mb-6 text-sm'>
            <span className='font-semibold'>Код:</span> {inventory.code}
          </P>
          <div className='mt-auto sm:mt-0'>
            {isAndroid ? (
              <IvaLocatorBtn locatorIvaLink={locatorIvaLink} inventoryId={inventoryId} />
            ) : (
              <Button className={isAndroid ? 'w-full' : ''}>
                {inventory.auditRoomInviteLink ? (
                  <a href={inventory.auditRoomInviteLink} target='_blank'>
                    Перейти в видео-конференцию
                  </a>
                ) : (
                  <span>ссылка на видео-конференцию отсутствует</span>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
