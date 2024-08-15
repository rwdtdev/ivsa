'use server';
import { ActionService } from '@/core/action/ActionService';
import { SearchParams } from '@/types';

export async function getMonitoringData(searchParams: SearchParams) {
  console.log('🚀 ~ getMonitoringData ~ searchParams:', searchParams);
  try {
    const actionService = new ActionService();
    const monitoringData = await actionService.getAll();
    return {
      items: monitoringData,
      pagination: {
        total: 1,
        pagesCount: 1,
        currentPage: 1,
        perPage: 10,
        from: 1,
        to: 1,
        hasMore: false
      }
    };
  } catch (error) {
    console.debug(error);
    return {
      items: [],
      pagination: { pagesCount: 0 }
    };
  }
}
