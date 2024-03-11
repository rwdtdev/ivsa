import { SortOrder } from '@/constants/data';
import { SoiParticipantRole } from '@/constants/mappings/soi';
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
    name: string;
    tabelNumber: string;
    role: UserRole;
    user: User;
    inventory: Inventory;
    event: Event;
  }[];
  inventories?: Inventory[];
};

export type CreateEventData = Omit<Event, 'participants' | 'createdAt' | 'updatedAt'> & {
  participants: {
    tabelNumber: string;
    roleId: SoiParticipantRole;
    name: string;
  }[];
};

export type UpdateEventData = Partial<
  Omit<Event, 'participants' | 'inventories' | 'createdAt' | 'updatedAt' | 'id'>
>;
