'use client';
import moment from 'moment';
import { P } from './ui/typography/p';
import { TIMEDATE_FORMAT } from '@/constants/date';
import { useEffect, useState } from 'react';
import { getInventoryLocationsStatsAction } from '@/app/actions/server/inventory-locations';

type LocationsStatistics = {
  total: number;
  perHour: number;
  perDay: number;
  lastLocation: {
    id: string;
    inventoryId: string;
    latitude: number;
    longitude: number;
    resourceId: string | null;
  } | null;
} | null;

function minutesToHmsString(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms / 1000) % 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}ч ${remainingMinutes}м ${seconds}с `;
}

export default function MetadataStatistic({ /* data, */ initialData, inventoryId }: any) {
  // console.log('🚀 ~ MetadataStatistic ~ lastMetadata:', lastMetadata, data);
  // const [dataAge, setDataAge] = useState('');
  const [timeBefore, setTimeBefore] = useState('');
  const [atTime, setAtTime] = useState('');
  const [data, setData] = useState<LocationsStatistics>(initialData);
  const lastMetadata = data ? data.lastLocation : null;

  useEffect(() => {
    const timerId = setInterval(async () => {
      const locationsStatistics = await getInventoryLocationsStatsAction(inventoryId);
      setData(locationsStatistics);
      setTimeBefore(
        minutesToHmsString(
          new Date().valueOf() -
            (locationsStatistics?.lastLocation?.dateTime.valueOf() || 0)
        )
      );
      setAtTime(
        moment(locationsStatistics?.lastLocation?.dateTime).format(TIMEDATE_FORMAT)
      );
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <div>
      <P className='font-semibold'>Информация о последних метаданных</P>
      {data && data.lastLocation ? (
        <div className='mt-5 flex flex-col'>
          <div className='mb-4 flex flex-col text-xs text-muted-foreground'>
            <P className='text-sm text-muted-foreground'>
              Были получены{' '}
              {/* {minutesToHmsString(new Date().valueOf() - lastMetadata.dateTime.valueOf())}{' '} */}
              {/* {timeBefore} назад в {moment(lastMetadata.dateTime).format(TIMEDATE_FORMAT)} */}
              {timeBefore} назад <br /> в {atTime}
            </P>
          </div>
          <p className='text-sm'>
            {lastMetadata?.latitude} ш., {lastMetadata?.longitude} д.
          </p>
        </div>
      ) : (
        <P className='text-sm'>Сбор метаданных еще не был запущен</P>
      )}
      <P className='font-semibold'>Статистика</P>
      <div className='mt-5 grid grid-cols-3 gap-4'>
        <div className='flex flex-col justify-center text-center'>
          <P className='text-2xl'>{(data && data.perHour) || 0}</P>
          <P>За час</P>
        </div>
        <div className='flex flex-col justify-center text-center'>
          <P className='text-2xl'>{(data && data.perDay) || 0}</P>
          <P>За день</P>
        </div>
        <div className='flex flex-col justify-center text-center'>
          <P className='text-2xl'>{(data && data.total) || 0}</P>
          <P>Всего</P>
        </div>
      </div>
    </div>
  );
}
