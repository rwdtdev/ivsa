'use server';
import { SortOrder } from '@/constants/data';
import { ActionService } from '@/core/action/ActionService';
import { searchParamsSchema } from '@/lib/query-params-validation';
import { SearchParams } from '@/types';
import { ActionStatus, ActionType } from '@prisma/client';

export async function getMonitoringData(searchParams: SearchParams) {
  try {
    const { page, per_page, search, from, to, status, type, sort } =
      searchParamsSchema.parse(searchParams);

    // Fallback page for invalid page numbers
    const pageAsNumber = Number(page);
    const fallbackPage = isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;
    // Number of items per page
    const perPageAsNumber = Number(per_page);
    const limit = isNaN(perPageAsNumber) ? 10 : perPageAsNumber;
    const [sortBy, sortDirection] = (sort?.split('.') as ['actionAt', SortOrder]) ?? [
      'actionAt',
      'desc'
    ];
    const statuses = (status?.split('.') as ActionStatus[]) ?? [];
    const types = (type?.split('.') as ActionType[]) ?? [];
    const actionService = new ActionService();
    return await actionService.getActionsWithParams({
      searchTerm: search,
      limit,
      page: fallbackPage,
      filter: {
        from,
        to,
        ...(statuses.length > 0 && { statuses }),
        ...(types.length > 0 && { types })
      },
      sort: {
        by: sortBy,
        direction: sortDirection
      }
    });
  } catch (error) {
    console.debug(error);
    return {
      items: [],
      pagination: { pagesCount: 0 }
    };
  }
}
