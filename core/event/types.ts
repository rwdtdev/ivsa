import {
  BriefingStatus,
  Event,
  EventStatus,
  Inventory,
  User,
  UserRole
} from '@prisma/client';
import { UpdateEventData } from '@/app/api/events/[eventId]/validation';
import { SortOrder } from '@/constants/data';

export type UpdateEventDataExtended = Partial<
  Omit<UpdateEventData, 'participants'> &
    Omit<
      Event,
      | 'createdAt'
      | 'updatedAt'
      | 'id'
      | 'inventories'
      | 'commandDate'
      | 'orderDate'
      | 'auditStart'
      | 'auditEnd'
    >
>;

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
    name: string;
    tabelNumber: string;
    role: UserRole;
    user: User;
    inventory: Inventory;
    event: Event;
  }[];
  inventories?: Inventory[];
};
