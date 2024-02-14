import { DashboardNav } from '@/components/dashboard-nav';
import { registryItems, dictionaryItems } from '@/constants/data';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  return (
    <nav className={cn(`relative hidden h-screen w-80 border-r pt-16 md:block`)}>
      <div className='space-y-4 py-4'>
        <div className='px-3 py-2'>
          <div className='space-y-1'>
            <DashboardNav items={dictionaryItems} />
            <DashboardNav items={registryItems} />
          </div>
        </div>
      </div>
    </nav>
  );
}
