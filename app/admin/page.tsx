import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import IvaAPI from '@/server/services/iva/api';
import { findConferenceTemplates } from '@/server/services/iva/api';

export default async function page() {
  const users = await IvaAPI.users.find();
  const conferenceTemplates = await findConferenceTemplates();

  await IvaAPI.conferenceSessions.remove('aa38d023-9132-4cd1-b32c-19ac7890104a');

  // await updateIvaUser('1a1362f6-a2b1-4526-b1f3-bfe6dc684831');

  // const createdRoom = await IvaAPI.conferenceSessions.createRoom({
  //   name: 'Test conference room',
  //   description: 'Test conference room',
  //   owner: {
  //     profileId: '1a1362f6-a2b1-4526-b1f3-bfe6dc684831'
  //   },
  //   conferenceTemplateId: '471f7e4e-15b7-48fc-bf34-88488b4e14dc',
  //   settings: {
  //     joinRestriction: 'ANYONE',
  //     attendeePermissions: ['SPEAKER_OTHER'],
  //     attendeeMediaState: 'NONE',
  //     features: []
  //   },
  //   participants: [
  //     {
  //       interlocutor: {
  //         profileId: '1a1362f6-a2b1-4526-b1f3-bfe6dc684831'
  //       },
  //       roles: ['ATTENDEE'],
  //       interpreterLanguagesPair: ['RUSSIAN']
  //     }
  //   ],
  //   guestPasscode: '12345678',
  //   speakerPasscode: '12345678'
  // });

  return (
    <>
      <h1>Admin</h1>
      <div className='flex h-screen overflow-hidden'>
        <main className='w-full p-16'>
          <ScrollArea className='h-[90vh] rounded-md border'>
            <pre className='text-sm'>IVA Users: {JSON.stringify(users, null, '\t')}</pre>
            <Separator />
            <pre>
              IVA conference templates: {JSON.stringify(conferenceTemplates, null, '\t')}
            </pre>
            <Separator />
            {/* <pre>IVA Created Room Info: {JSON.stringify(createdRoom, null, '\t')}</pre> */}
          </ScrollArea>
        </main>
      </div>
    </>
  );
}
