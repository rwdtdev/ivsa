import { getEventByIdAction } from '@/app/actions/server/events';
import { getInventoryByIdAction } from '@/app/actions/server/inventories';
import { VideosTable } from '@/components/tables/videos-table';
import { authConfig } from '@/lib/auth-options';
import { SearchParams } from '@/types';
import { ParticipantRole } from '@prisma/client';
import { getServerSession } from 'next-auth';

interface Props {
  params: {
    eventId: string;
    inventoryId: string;
  };
  searchParams: SearchParams;
}
export default async function VideoList({ params: { inventoryId, eventId } }: Props) {
  const session = await getServerSession(authConfig);
  const inventoryWithRecourses = await getInventoryByIdAction(inventoryId);
  const event = await getEventByIdAction(eventId);
  if (!event) {
    return <div>Нет такого события</div>;
  }
  if (!inventoryWithRecourses?.resources) return <div>Нет видеозаписей</div>;
  const participant = event.participants.find(
    (participant) => participant.userId === session?.user.id
  );
  const isUserChairman = participant?.role === ParticipantRole.CHAIRMAN;
  return (
    <div className='flex grow flex-col overflow-hidden'>
      <VideosTable
        inventoryWithRecourses={inventoryWithRecourses}
        isUserChairman={isUserChairman}
      />
    </div>
  );
}
