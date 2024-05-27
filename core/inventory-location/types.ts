import { InventoryLocation } from '@prisma/client';

export type InventoryLocationCreateData = Omit<InventoryLocation, 'id' | 'createdAt'>;
