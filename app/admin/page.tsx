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
  const conferenceTemplates = await ivaService.findConferenceTemplates();

  const conferenceParticipants = await ivaService.findConferenceParticipants(
    'a1191fee-2fb5-43db-8f25-e547a1fc9c96',
    {
      requestedData: ['JOIN_LINK']
    }
  );

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
            <Collapsible className='mt-2'>
              <CollapsibleTrigger>
                <Button>IVA conference templates</Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <pre>{JSON.stringify(conferenceTemplates, null, '\t')}</pre>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible className='mt-2'>
              <CollapsibleTrigger>
                <Button>IVA Invite Links</Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <pre> {JSON.stringify(conferenceParticipants, null, '\t')}</pre>
              </CollapsibleContent>
            </Collapsible>
          </ScrollArea>
        </main>
      </div>
    </>
  );
}
