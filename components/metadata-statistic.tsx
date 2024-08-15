import moment from 'moment';
import { P } from './ui/typography/p';
import { TIMEDATE_FORMAT } from '@/constants/date';

function minutesToHmsString(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms / 1000) % 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}ч ${remainingMinutes}м ${seconds}с`;
}

export default function MetadataStatistic({ data }: any) {
  const lastMetadata = data ? data.lastLocation : null;

  return (
    <div>
      <P className='font-semibold'>Информация о последних метаданных</P>
      {data && data.lastLocation ? (
        <div className='flex flex-col mt-5'>
          <div className='mb-4 flex flex-col text-xs text-muted-foreground'>
            <P className='text-sm text-muted-foreground'>
              Были получены{' '}
              {minutesToHmsString(new Date().valueOf() - lastMetadata.dateTime.valueOf())} назад в{' '}
              {moment(lastMetadata.dateTime).format(TIMEDATE_FORMAT)}
            </P>
          </div>
          <p className='text-sm'>{lastMetadata.latitude} ш., {lastMetadata.longitude} д.</p>
        </div>
      ) : (
        <P className='text-sm'>Сбор метаданных еще не был запущен</P>
      )}
      <P className='font-semibold'>Статистика</P>
      <div className='grid grid-cols-3 gap-4 mt-5'>
        <div className='flex flex-col justify-center text-center'>
          <P className='text-2xl'>{data && data.perHour || 0}</P>
          <P>За час</P>
        </div>
        <div className='flex flex-col justify-center text-center'>
          <P className='text-2xl'>{data && data.perDay || 0}</P>
          <P>За день</P>
        </div>
        <div className='flex flex-col justify-center text-center'>
          <P className='text-2xl'>{data && data.total || 0}</P>
          <P>Всего</P>
        </div>
      </div>
    </div>
  );
}
