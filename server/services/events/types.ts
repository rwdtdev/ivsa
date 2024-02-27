import { SortOrder } from '@/constants/data';
import { RequiredNotNull } from '@/server/types';
import { Event, EventStatus, Inventory, User, UserRole } from '@prisma/client';

export type EventsGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  sortDirection: SortOrder;
  query: {
    from?: string;
    to?: string;
    statuses?: EventStatus[];
  };
}>;

export type EventView = Omit<Event, 'startAt' | 'endAt'> & {
  startAt: string;
  endAt: string;
  participants: {
    role: UserRole;
    user: User;
    inventory: Inventory;
  }[];
  inventories: Inventory[];
};

export type CreateEventData = RequiredNotNull<
  Omit<Event, 'participants'> & {
    participants: {
      tabelNumber: string;
      roleId: string;
    }[];
  }
>;
