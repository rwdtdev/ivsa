'use server';

import { SortOrder } from '@/constants/data';
import { searchParamsSchema } from '@/lib/query-params-validation';
import { EventService } from '@/server/services/events';
import { EventView } from '@/server/services/events/types';
import { PaginatedResponse } from '@/server/types';
import { SearchParams } from '@/types';
import { Event, EventType } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';

export async function getEventsAction(
  searchParams: SearchParams,
  type: EventType
): Promise<
  PaginatedResponse<EventView> | { items: []; pagination: { pagesCount: number } }
> {
  noStore();
  try {
    const { page, per_page, sort, search, from, to, status } =
      searchParamsSchema.parse(searchParams);

    // Fallback page for invalid page numbers
    const pageAsNumber = Number(page);
    const fallbackPage = isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;
    // Number of items per page
    const perPageAsNumber = Number(per_page);
    const limit = isNaN(perPageAsNumber) ? 10 : perPageAsNumber;
    // Number of items to skip
    const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0;
    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    const [column, order] = (sort?.split('.') as [
      keyof Event | undefined,
      SortOrder
    ]) ?? ['startAt', 'asc'];

    const statuses = (status?.split('.') as Event['status'][]) ?? [];

    const eventService = new EventService();

    return await eventService.getEvents({
      searchTerm: search,
      limit,
      page: fallbackPage,
      query: {
        type,
        from,
        to,
        ...(statuses.length > 0 && { statuses })
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

    return await eventService.getEventById(id);
  } catch (err) {
    console.error(err);
    return null;
  }
};
