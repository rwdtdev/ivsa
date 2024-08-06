'use server';

import { searchParamsSchema } from '@/lib/query-params-validation';
import { EventService } from '@/core/event/EventService';
import { EventView } from '@/core/event/types';
import { PaginatedResponse } from '@/types';
import { SearchParams } from '@/types';
import { InventoryObject } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';
import { InventoryObjectService } from '@/core/inventory-object/InventoryObjectService';
import { SortOrder } from '@/constants/data';

export type PaginatedInventoryObject =
  | PaginatedResponse<InventoryObject>
  | { items: []; pagination: { pagesCount: number } };

export async function getInventoryObjectsByInventoryIdAction(
  inventoryId: string,
  searchParams: SearchParams
): Promise<PaginatedInventoryObject> {
  noStore();
  try {
    const { page, per_page, search, sort } = searchParamsSchema.parse(searchParams);

    // Fallback page for invalid page numbers
    const pageAsNumber = Number(page);
    const fallbackPage = isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;
    // Number of items per page
    const perPageAsNumber = Number(per_page);
    const limit = isNaN(perPageAsNumber) ? 20 : perPageAsNumber;

    const [sortBy, sortDirection] = (sort?.split('.') as [
      keyof InventoryObject,
      SortOrder
    ]) ?? ['name', 'asc'];

    const inventoryObjectService = new InventoryObjectService();

    return await inventoryObjectService.getByInventoryId(inventoryId, {
      searchTerm: search,
      limit,
      page: fallbackPage,
      sort: {
        by: sortBy,
        direction: sortDirection
      }
    });
  } catch (err) {
    console.log(err);
    return {
      items: [],
      pagination: {
        pagesCount: 0
      }
    };
  }
}

export const getEventByIdAction = async (id: string): Promise<EventView | null> => {
  try {
    const eventService = new EventService();

    return await eventService.getById(id);
  } catch (err) {
    console.error(err);
    return null;
  }
};
