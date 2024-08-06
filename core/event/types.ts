import {
  BriefingStatus,
  Event,
  EventStatus,
  Inventory,
  InventoryObject,
  Participant,
  User
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
  filter: {
    from?: string;
    to?: string;
    userId?: string;
    statuses?: EventStatus[];
    briefingStatuses?: BriefingStatus[];
  };
}> & {
  sort: {
    by: keyof Event;
    direction: SortOrder;
  };
};

export type InventoryObjectsGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  sortDirection: SortOrder;
}> & {
  sort: {
    by: keyof InventoryObject;
    direction: SortOrder;
  };
};

export type ParticipantWithUser = Participant & { user: User };

export type RegisteredParticipant = Participant & {
  user: Omit<User, 'ivaProfileId'> & { ivaProfileId: string };
};

export type EventWithIncludeFileds = Event & {
  participants?: ParticipantWithUser[];
  inventories?: Inventory[];
};

export type EventView = Omit<
  EventWithIncludeFileds,
  'startAt' | 'endAt' | 'orderDate' | 'commandDate' | 'participants' | 'inventories'
> & {
  startAt: string;
  endAt: string;
  orderDate: string;
  commandDate: string;
  participants: ParticipantWithUser[] | [];
  inventories: Inventory[] | [];
};
