'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { PlayIconCustom } from '@/components/ui/customIcons/PlayIconCustom';
import { format } from 'date-fns';
import { InventoryResourceWithAddress } from '@/app/actions/server/inventories';

interface Props {
  data: InventoryResourceWithAddress;
}

export default function VideoPlay({ data }: Props) {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div>
            <PlayIconCustom />
          </div>
        </DialogTrigger>
        <DialogContent className='max-w-[900px]'>
          <DialogHeader>
            <DialogTitle>{data.address}</DialogTitle>
            <DialogDescription>
              {format(data.startAt || '', 'dd.MM.yyyy')}{' '}
              {format(data.startAt || '', 'HH:mm')}
              {'-'}
              {format(data.endAt || '', 'HH:mm')}
            </DialogDescription>
          </DialogHeader>
          <div className='py-2'>
            {data.s3Url ? (
              <video
                src={'/api/s3video/' + data.s3Url}
                width='100%'
                itemType='video/mp4'
                autoPlay
                controls
              >
                <track src={'/api/s3subtitles/' + data.s3Url} default kind='subtitles' />
              </video>
            ) : (
              <p>Видео отсутствует</p>
            )}
          </div>
          <DialogFooter className='flex-col justify-start sm:flex-col sm:space-x-0'>
            <span>hash видео-файла: {data.videoHash}</span>
            <span>hash файла метаданных: {data.metadataHash}</span>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    //
  );
}
