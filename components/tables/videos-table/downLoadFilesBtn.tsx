import { InventoryResourceWithAddress } from '@/app/actions/server/inventories';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
  data: InventoryResourceWithAddress;
}

export default function DownLoadFilesBtn({ data }: Props) {
  const [isDownloading, setIsDownloading] = useState(false);

  async function downLoadFiles(
    data: InventoryResourceWithAddress,
    type: 'meta' | 'video'
  ) {
    setIsDownloading(true);
    try {
      const res = await fetch('/api/download-files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ s3Url: data.s3Url, type, videoFileName: data.name })
      });
      const blob = await res.blob();
      const newBlob = new Blob([blob]);
      const blobUrl = window.URL.createObjectURL(newBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      if (type === 'meta') {
        link.setAttribute('download', `${data.name}.txt`);
      } else if (type === 'video') {
        // link.setAttribute('download', `${data.name}`);
        link.setAttribute('download', `${data.name}.mp4`);
      }
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // clean up Url
      window.URL.revokeObjectURL(blobUrl);
      if (type === 'video') setIsDownloading(false);
    } catch (err) {
      setIsDownloading(false);
      console.log(err);
    }
  }

  async function downloadVideosHash(data: InventoryResourceWithAddress) {
    const newBlob = new Blob([data.videoHash || ''], { type: 'text/plain' });
    const blobUrl = window.URL.createObjectURL(newBlob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', `${data.name}-videohash.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  }
  return (
    <>
      <button
        onClick={() => {
          downloadVideosHash(data);
          // downLoadFiles(data, 'meta');
          downLoadFiles(data, 'video');
        }}
      >
        {isDownloading ? (
          <Loader2 className='h-5 w-5 animate-spin' />
        ) : (
          <Download size={23} className='display: inline' />
        )}
      </button>
    </>
  );
}
