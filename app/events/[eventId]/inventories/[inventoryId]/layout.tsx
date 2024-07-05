import { SearchParams } from '@/types';
import TabsCover from './tabs-wrapper';
import { getInventoryByIdAction } from '@/app/actions/server/inventories';
import Header from '@/components/layout/header';
import BreadCrumb from '@/components/breadcrumb';
import TabsWrapper from './tabs-wrapper';
import { getInventoryById } from '@/app/actions/server/getInventoryById';

interface Props {
  children: React.ReactNode;
  params: {
    eventId: string;
    inventoryId: string;
  };
  // searchParams: SearchParams;
}

export default async function InventoryLayout({
  children,
  params: { eventId, inventoryId }
}: Props) {
  const inventory = await getInventoryById(inventoryId);
  const breadcrumbItems = [
    {
      title: 'Реестр инвентаризаций',
      link: '/events'
    },
    {
      title: 'Инвентаризация',
      link: `/events/${eventId}`
    },
    {
      title: `Инвентаризационная опись ${inventory?.shortName}`,
      link: ''
    }
  ];

  return (
    <div className='flex h-screen flex-col'>
      <Header title={'Инвентаризационная опись'} />
      <main className='flex grow flex-col overflow-hidden px-8 pb-3'>
        <BreadCrumb items={breadcrumbItems} />
        <TabsWrapper eventId={eventId} inventoryId={inventoryId} />
        {children}
      </main>
    </div>
  );
}
