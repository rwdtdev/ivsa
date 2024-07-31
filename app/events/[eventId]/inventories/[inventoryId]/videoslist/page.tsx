import { getInventoryByIdAction } from '@/app/actions/server/inventories';
import { VideosTable } from '@/components/tables/videos-table';
import { SearchParams } from '@/types';

interface Props {
  params: {
    eventId: string;
    inventoryId: string;
  };
  searchParams: SearchParams;
}
export default async function VideoList({ params: { inventoryId } }: Props) {
  const inventoryWithRecourses = await getInventoryByIdAction(inventoryId);

  if (!inventoryWithRecourses?.resources) return <div>Нет видеозаписей</div>;
  return (
    <div className='flex grow flex-col overflow-hidden'>
      <VideosTable inventoryWithRecourses={inventoryWithRecourses} />
    </div>
  );
}
