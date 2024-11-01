import { InventoryResourceWithAddress } from '@/app/actions/server/inventories';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
  data: InventoryResourceWithAddress;
}

export type DownloadFileData = {
  s3Url: string | null;
  type: 'meta' | 'video';
  videoFileName: string;
};

export default function DownLoadFilesBtn({ data }: Props) {
  const [isDownloading, setIsDownloading] = useState(false);

  async function downLoadFiles(
    data: InventoryResourceWithAddress,
    type: 'meta' | 'video'
  ) {
    setIsDownloading(true);
    const downloadFileData = {
      s3Url: data.s3Url,
      type,
      videoFileName: data.name,
    };
    try {
      const res = await fetch('/api/download-files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(downloadFileData)
      });
      const blob = await res.blob();
      const newBlob = new Blob([blob]);
      const blobUrl = window.URL.createObjectURL(newBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      if (type === 'video') {
        link.setAttribute('download', `${data.name}`);
      } else if (type === 'meta') {
        link.setAttribute('download', `${data.name}.txt`);
      }
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

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
    link.setAttribute('download', `${data.name.slice(0, -4)}-videohash.txt`);
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
