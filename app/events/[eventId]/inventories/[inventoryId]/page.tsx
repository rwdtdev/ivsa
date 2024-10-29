import { getEventByIdAction } from '@/app/actions/server/events';
import { getInventoryById } from '@/app/actions/server/getInventoryById';
import { getInventoryLocationsStatsAction } from '@/app/actions/server/inventory-locations';
import { InventoryInfoCard } from '@/components/inventory-info-card';
import MetadataStatistic from '@/components/metadata-statistic';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { authConfig } from '@/lib/auth-options';
import { SearchParams } from '@/types';
import { InventoryStatus } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';

export const metadata = {
  title: 'Опись инвентаризации'
};

interface Props {
  params: {
    eventId: string;
    inventoryId: string;
  };
  searchParams: SearchParams;
}

export default async function InventoryPage({ params: { inventoryId, eventId } }: Props) {
  const session = await getServerSession(authConfig);
  const ua = headers().get('user-agent');
  const isAndroid = /android/i.test(ua || '');
  const inventory = await getInventoryById(inventoryId);
  const event = await getEventByIdAction(eventId);
  if (!event) {
    return <div>Нет такого события</div>;
  }

  const participant = event.participants.find(
    (participant) => participant.userId === session?.user.id
  );

  const isUserChairman = participant?.role === 'CHAIRMAN';

  const locationsStatistics = await getInventoryLocationsStatsAction(inventoryId);

  if (!inventory) {
    return <CardContent>Нет такой инвентаризации!!</CardContent>;
  }
  const locatorIvaLink = {
    locatorIvaStart: `app://asvi.rwdt/start?inventoryId=${inventoryId}&appKey${process.env.LOCATION_RECORDER_APP_KEY}&userId=${session?.user.id}`,
    locatorStop: `app://asvi.rwdt/stop?appKey=${process.env.LOCATION_RECORDER_APP_KEY}`
  };
  return (
    <ScrollArea>
      <div className='flex grow flex-col lg:flex-row'>
        <InventoryInfoCard
          inventory={inventory}
          isUserChairman={isUserChairman}
          isAndroid={isAndroid}
          locatorIvaLink={locatorIvaLink}
          participants={event.participants}
        />
        <Card className='md:cols-span-1 col-span-1 flex grow flex-col pb-4 pt-3 sm:col-span-2 sm:grow-0 lg:col-span-1 2xl:col-span-1'>
          <CardContent className='flex grow flex-col'>
            <MetadataStatistic
              initialData={locationsStatistics}
              inventoryId={inventoryId}
              isInventoryProcessed={inventory.status === InventoryStatus.CLOSED || inventory.status === InventoryStatus.REMOVED}
            />
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
