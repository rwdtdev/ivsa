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
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface Props {
  data: InventoryResourceWithAddress;
  inventoryNumber: string;
}

export default function VideoPlay({ data, inventoryNumber }: Props) {
  const [cbData, setCbData] = useState('');

  // useEffect(() => {
  //   (async () => {
  //     const text = await navigator.clipboard?.readText();
  //     setCbData(text);
  //   })();
  // });
  return (
    <div>
      <Dialog>
        <DialogTrigger
          asChild
          onClick={() => {
            (async () => {
              const text = await navigator.clipboard?.readText();
              setCbData(text);
            })();
          }}
        >
          <div>
            <PlayIconCustom />
          </div>
        </DialogTrigger>
        <DialogContent className='max-w-[900px]'>
          <DialogHeader>
            <DialogTitle>{data.address}</DialogTitle>
            <DialogDescription>
              {data.startAt && format(data.startAt, 'dd.MM.yyyy')}{' '}
              {data.startAt && format(data.startAt, 'HH:mm')}
              {'-'}
              {data.endAt && format(data.endAt, 'HH:mm')}
              {'. '}
              {`Комплексная опись №: ${inventoryNumber}`}
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
          <DialogFooter className='hidden justify-start space-y-3 text-sm text-gray-600 sm:flex sm:flex-col sm:space-x-0'>
            <div className='flex flex-wrap'>
              <span className='mr-1'>hash&nbsp;видео-файла: </span>
              <span className='flex'>
                {data.videoHash}
                {cbData === data.videoHash ? (
                  <Check className='h-5' />
                ) : (
                  <Copy
                    className='h-4'
                    onClick={async () => {
                      await navigator.clipboard?.writeText(data.videoHash || '');
                      setCbData(data.videoHash || '');
                    }}
                  />
                )}
              </span>
            </div>
            <div className='flex flex-wrap'>
              <span className=''>hash файла метаданных: </span>
              <span className='flex flex-nowrap'>
                {data.metadataHash}
                {cbData === data.metadataHash ? (
                  <Check className='h-5' />
                ) : (
                  <Copy
                    className='h-4'
                    onClick={async () => {
                      await navigator.clipboard?.writeText(data.metadataHash || '');
                      setCbData(data.metadataHash || '');
                    }}
                  />
                )}
              </span>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    //
  );
}
