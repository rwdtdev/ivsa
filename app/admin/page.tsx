import { ScrollArea } from '@/components/ui/scroll-area';
import { IvaService } from '@/core/iva/IvaService';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

export default async function page() {
  const ivaService = new IvaService();
  const users = await ivaService.findUsers('');

  return (
    <>
      <h1>Admin</h1>
      <div className='flex h-screen overflow-hidden'>
        <main className='w-full p-16'>
          <ScrollArea className='h-[90vh] rounded-md border'>
            <Collapsible className='mt-2'>
              <CollapsibleTrigger>
                <Button>IVA Users</Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <pre>{JSON.stringify(users, null, '\t')}</pre>
              </CollapsibleContent>
            </Collapsible>
          </ScrollArea>
        </main>
      </div>
    </>
  );
}
