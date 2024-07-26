import { getEventByIdAction } from '@/app/actions/server/events';
import { getInventoryById } from '@/app/actions/server/getInventoryById';
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
  params: { inventoryId, eventId },
  searchParams
}: Props) {
  const selectedInventoryId = searchParams.locinvid || inventoryId;
  const inventoryObjects = await getInventoryObjectsByInventoryIdAction(
    selectedInventoryId,
    searchParams
  );
  const events = await getEventByIdAction(eventId);
  const complexAndLocalInventories =
    events?.inventories.filter(
      (inventory) => inventory.id === inventoryId || inventory.parentId === inventoryId
    ) || [];

  const inventory = await getInventoryById(selectedInventoryId);
  if (!inventory) return <div>Инвентаризация не найдена</div>;
  return (
    <div className='flex grow flex-col overflow-hidden'>
      {inventoryObjects && events && (
        <InventoryObjectsTable
          inventoryCode={inventory.code as InventoryCode}
          inventoryObjects={inventoryObjects}
          inventories={complexAndLocalInventories}
        />
      )}
    </div>
  );
}
