'use server';

import { searchParamsSchema } from '@/lib/query-params-validation';
import { EventService } from '@/core/event/EventService';
import { EventView } from '@/core/event/types';
import { PaginatedResponse } from '@/types';
import { SearchParams } from '@/types';
import { Event } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';

export async function getEventsAction(
  searchParams: SearchParams,
  queryParams: { userId?: string } = {}
): Promise<
  PaginatedResponse<EventView> | { items: []; pagination: { pagesCount: number } }
> {
  noStore();
  try {
    const { page, per_page, search, from, to, status, briefingStatus } =
      searchParamsSchema.parse(searchParams);

    // Fallback page for invalid page numbers
    const pageAsNumber = Number(page);
    const fallbackPage = isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;
    // Number of items per page
    const perPageAsNumber = Number(per_page);
    const limit = isNaN(perPageAsNumber) ? 10 : perPageAsNumber;
    // Number of items to skip
    // const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0;
    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    // const [column, order] = (sort?.split('.') as [
    //   keyof Event | undefined,
    //   SortOrder
    // ]) ?? ['startAt', 'asc'];

    const statuses = (status?.split('.') as Event['status'][]) ?? [];
    const briefingStatuses =
      (briefingStatus?.split('.') as Event['briefingStatus'][]) ?? [];

    const eventService = new EventService();

    return await eventService.getEvents({
      searchTerm: search,
      limit,
      page: fallbackPage,
      query: {
        from,
        to,
        ...(statuses.length > 0 && { statuses }),
        ...(briefingStatuses.length > 0 && { briefingStatuses }),
        ...queryParams
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
