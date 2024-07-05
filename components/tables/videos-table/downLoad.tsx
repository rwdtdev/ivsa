import { VideoResourcesTest } from '@/app/events/[eventId]/inventories/[inventoryId]/videoslist/page';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
  data: VideoResourcesTest;
}

export default function DownloadFile({ data }: Props) {
  const [isDownloading, setIsDownloading] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          // download video-file
          setIsDownloading(true);
          const res = await fetch(`/api/downloadVideo/${data.s3Url}`);
          const blob = await res.blob();
          const newBlob = new Blob([blob]);
          const blobUrl = window.URL.createObjectURL(newBlob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.setAttribute('download', `${data.s3Url}.mp4`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          // clean up Url
          window.URL.revokeObjectURL(blobUrl);
          setIsDownloading(false);
        } catch (err) {
          console.log(err);
        }

        // download hash as txt file
        const link2 = document.createElement('a');
        link2.setAttribute(
          'href',
          'data:text/plain;charset=utf-8,' + encodeURIComponent(data.videoHash || '')
        );
        link2.setAttribute('download', data.s3Url || 'hash');
        link2.style.display = 'none';
        document.body.appendChild(link2);
        link2.click();
        document.body.removeChild(link2);
      }}
    >
      {isDownloading ? (
        <Loader2 className='h-5 w-5 animate-spin' />
      ) : (
        <Download size={23} className='display: inline' />
      )}
    </button>
  );
}
