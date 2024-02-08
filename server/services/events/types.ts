import { SortOrder } from '@/constants/data';
import { Event, EventStatus, EventType, User } from '@prisma/client';

export type EventsGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  sortDirection: SortOrder;
  query: {
    type: EventType;
    from?: string;
    to?: string;
    statuses?: EventStatus[];
  };
}>;

export type EventView = Omit<Event, 'startAt' | 'endAt'> & {
  startAt: string;
  endAt: string;
  participants: User[];
};
