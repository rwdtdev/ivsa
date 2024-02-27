import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import IvaAPI from '@/server/services/iva/api';
import { findConferenceTemplates } from '@/server/services/iva/api';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

export default async function page() {
  const users = await IvaAPI.users.find('');
  const conferenceTemplates = await findConferenceTemplates();

  // await IvaAPI.conferenceSessions.remove('aa38d023-9132-4cd1-b32c-19ac7890104a');

  // console.log(
  //   await IvaAPI.conferenceSessions.find('a1191fee-2fb5-43db-8f25-e547a1fc9c96')
  // );

  await IvaAPI.users.remove('ffd53467-f8d4-4f31-ad83-f77780cff0e4');

  const conferenceParticipants = await IvaAPI.conferenceSessions.findParticipants(
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
