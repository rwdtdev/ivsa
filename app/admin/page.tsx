import { ScrollArea } from '@/components/ui/scroll-area';
import { findIvaUsers } from '@/server/services/iva';

export default async function page() {
  const users = await findIvaUsers('');
  return (
    <>
      <h1>Admin</h1>
      <ScrollArea className='h-[90vh] rounded-md border'>
        <pre>IVA Server Status: {JSON.stringify(users, null, '\t')}</pre>
      </ScrollArea>
    </>
  );
}
