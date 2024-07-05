'use client';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useState } from 'react';

type TabsValue = 'infoTab' | 'inventoryListTab' | 'videoTab';

function whichTabByPath(path: string[]): TabsValue {
  if (path.at(-1) === 'itemslist') {
    return 'inventoryListTab';
  }
  if (path.at(-1) === 'videoslist') {
    return 'videoTab';
  }
  return 'infoTab';
}

export default function TabsWrapper({
  eventId,
  inventoryId
}: {
  eventId: string;
  inventoryId: string;
}) {
  const [selectedTab, setSelectedTab] = useState<TabsValue>('infoTab');
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    setSelectedTab(whichTabByPath(pathname.split('/')));
  }, []);

  return (
    <Tabs value={selectedTab} className='my-2 md:mt-0' activationMode='manual'>
      <TabsList className='grid w-full grid-cols-3'>
        <TabsTrigger
          value='infoTab'
          onFocus={() => {
            router.push(`/events/${eventId}/inventories/${inventoryId}`);
            setSelectedTab('infoTab');
          }}
        >
          Информация
        </TabsTrigger>
        <TabsTrigger
          value='inventoryListTab'
          onFocus={() => {
            router.push(`/events/${eventId}/inventories/${inventoryId}/itemslist`);
            setSelectedTab('inventoryListTab');
          }}
          className='t'
        >
          Опись
        </TabsTrigger>
        <TabsTrigger
          value='videoTab'
          onFocus={() => {
            router.push(`/events/${eventId}/inventories/${inventoryId}/videoslist`);
            setSelectedTab('videoTab');
          }}
        >
          <span className='hidden sm:block'>Видеоматериалы</span>
          <span className='sm:hidden'>Видео</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
