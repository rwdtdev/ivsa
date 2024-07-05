import { getInventoryById } from '@/app/actions/server/getInventoryById';
import { getInventoryByIdAction } from '@/app/actions/server/inventories';
import { getInventoryObjectsByInventoryIdAction } from '@/app/actions/server/inventoryObjects';
import { InventoryObjectsTable } from '@/components/tables/inventory-objects-table';
import { InventoryCode } from '@/core/inventory/types';
import { SearchParams } from '@/types';

interface Props {
  params: {
    eventId: string;
    inventoryId: string;
  };
  searchParams: SearchParams;
}
export default async function InventoryItemsList({
  params: { eventId, inventoryId },
  searchParams
}: Props) {
  const inventory = await getInventoryById(inventoryId);

  if (!inventory) return <div>Инвенторизация не найдена</div>;

  const inventoryObjects = await getInventoryObjectsByInventoryIdAction(
    inventory.id,
    searchParams
  );
  return (
    <div className='flex grow flex-col overflow-hidden'>
      {inventoryObjects && (
        <InventoryObjectsTable
          inventoryCode={inventory.code as InventoryCode}
          inventoryObjects={inventoryObjects}
        />
      )}
    </div>
  );
}
