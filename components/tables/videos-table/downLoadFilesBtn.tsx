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
        body: JSON.stringify({ s3Url: data.s3Url, type })
      });
      const blob = await res.blob();
      const newBlob = new Blob([blob]);
      const blobUrl = window.URL.createObjectURL(newBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      if (type === 'meta') {
        link.setAttribute('download', `${data.name.slice(0, -4)}.txt`);
      } else {
        link.setAttribute('download', `${data.name}`);
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
  return (
    <>
      <button
        onClick={() => {
          downLoadFiles(data, 'meta');
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
