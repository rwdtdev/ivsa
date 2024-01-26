import { ScrollArea } from "@/components/ui/scroll-area";
import { getServerStatus } from "@/server/services/iva";

export default async function page() {
  const ivaServerStatus = await getServerStatus();
  return <>
    <h1>Admin</h1>
    <ScrollArea className='h-[90vh] rounded-md border'>
      <pre>IVA Server Status: {JSON.stringify(ivaServerStatus, null, '\t')}</pre>
    </ScrollArea>
  </>;
}
