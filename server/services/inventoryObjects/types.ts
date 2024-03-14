import { InventoryObject } from '@prisma/client';

export type InventoryObjectCreateData = Omit<InventoryObject, 'createdAt' | 'updatedAt'>;
