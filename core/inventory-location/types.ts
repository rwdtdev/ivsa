import { InventoryLocation } from '@prisma/client';

export type InventoryLocationCreateData = Omit<
  InventoryLocation,
  'id' | 'createdAt' | 'resourceId' | 'dateTime'
> & {
  dateTime: Date;
};
