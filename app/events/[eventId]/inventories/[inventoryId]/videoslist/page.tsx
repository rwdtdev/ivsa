import { getInventoryByIdAction } from '@/app/actions/server/inventories';
import { VideosTable } from '@/components/tables/videos-table';
import { SearchParams } from '@/types';

export interface VideoResourcesTest {
  id: string;
  address: string;
  startAt: Date | null;
  endAt: Date | null;
  inventoryId: string;
  s3Url: string | null;
  s3MetadataUrl: string | null;
  videoHash: string | null;
  // type: $Enums.ResourceType;
}

// const videoList: VideoResourcesTest[] = [
//   {
//     id: '0',
//     address: 'железнодорожный тупик №6',
//     startAt: new Date('2024-02-06T15:23'),
//     endAt: new Date('2024-02-06T17:54'),
//     inventoryId: '6f1ce596-8ac3-4a83-aff1-3f568e211629',
//     s3Url: 'clvw3708a001m14pcwtxhpu7f/e7800efd-693e-488c-87bb-b43727a69488/0',
//     s3MetadataUrl: 'clvw3708a001m14pcwtxhpu7f/e7800efd-693e-488c-87bb-b43727a69488/0',
//     videoHash: 'jh23j4hg5j2k3g5'
//     // type: 'VIDEO'
//   },
//   {
//     id: '1',
//     address: 'железнодорожный тупик №7',
//     startAt: new Date('2024-02-06T11:15'),
//     endAt: new Date('2024-02-06T13:46'),
//     inventoryId: '6f1ce596-8ac3-4a83-aff1-3f568e211629',
//     s3Url: 'clw7qdw3u0024qupg25c0yl3r/d9e70851-2909-41e7-ad98-440bdcbed589/1',
//     s3MetadataUrl: 'clw7qdw3u0024qupg25c0yl3r/d9e70851-2909-41e7-ad98-440bdcbed589/0',
//     videoHash: 'kjgg7868kgjhg876'
//     // type: 'VIDEO'
//   }
// ];

interface Props {
  params: {
    eventId: string;
    inventoryId: string;
  };
  searchParams: SearchParams;
}
export default async function VideoList({
  params: { eventId, inventoryId },
  searchParams
}: Props) {
  const inventoryWithRecourses = await getInventoryByIdAction(inventoryId);
  console.log('🚀 ~ inventory:', inventoryWithRecourses);

  if (!inventoryWithRecourses?.resources) return <div>Нет видеозаписей</div>;
  return (
    <div className='flex grow flex-col overflow-hidden'>
      <VideosTable resources={inventoryWithRecourses.resources} />
    </div>
  );
}
