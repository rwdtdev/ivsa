import { SortOrder } from '@/constants/data';
import { RequiredNotNull } from '@/server/types';
import {
  BriefingStatus,
  Event,
  EventStatus,
  Inventory,
  User,
  UserRole
} from '@prisma/client';

export type EventsGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  sortDirection: SortOrder;
  query: {
    from?: string;
    to?: string;
    statuses?: EventStatus[];
    briefingStatuses?: BriefingStatus[];
  };
}>;

export type EventView = Omit<Event, 'startAt' | 'endAt' | 'commandDate' | 'orderDate'> & {
  startAt: string;
  endAt: string;
  commandDate: string;
  orderDate: string;
  participants?: {
    role: UserRole;
    user: User;
    inventory: Inventory;
    event: Event;
  }[];
  inventories?: Inventory[];
};

export type CreateEventData = RequiredNotNull<
  Omit<Event, 'participants'> & {
    participants: {
      tabelNumber: string;
      roleId: string;
    }[];
  }
>;
