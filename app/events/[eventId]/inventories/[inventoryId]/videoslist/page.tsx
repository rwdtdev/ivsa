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
  name: string;
}

interface Props {
  params: {
    eventId: string;
    inventoryId: string;
  };
  searchParams: SearchParams;
}
export default async function VideoList({
  params: { inventoryId },
  searchParams
}: Props) {
  console.log('🚀 ~ searchParams:', searchParams);
  const inventoryWithRecourses = await getInventoryByIdAction(inventoryId);

  if (!inventoryWithRecourses?.resources) return <div>Нет видеозаписей</div>;
  return (
    <div className='flex grow flex-col overflow-hidden'>
      <VideosTable resources={inventoryWithRecourses.resources} />
    </div>
  );
}
