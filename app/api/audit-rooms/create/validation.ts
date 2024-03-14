import { z } from 'zod';
import { InventoryCode, InventoryCodes } from '@/server/services/inventories/types';

const inventoryObjectSchema = z
  .object({
    NAME: z.string(),
    CODE: z.string(),
    LOCATION: z.string(),
    FACTORYNUMBER: z.string(),
    PLACEMENT: z.string(),
    EIID: z.string(),
    NETWORK_NUM: z.string(),
    PASSPORTNUM: z.string(),
    EINAME: z.string(),
    BATCH: z.string(),
    OBJECT_STATE: z.string(),
    BU_KOL: z.number(),
    NOMNUMBER: z.string(),
    INVNUMBER: z.string()
  })
  .partial()
  .strict();

export const CreateInventorySchema = z
  .object({
    eventId: z.string().min(1),
    inventoryId: z.string().min(1),
    inventoryCode: z.nativeEnum(InventoryCode),
    inventoryDate: z.string().datetime().min(1),
    inventoryNumber: z.string().min(1),
    inventoryObjects: z.array(inventoryObjectSchema)
  })
  .strict()
  .refine(
    ({ inventoryObjects, inventoryCode }) => {
      const { fieldsRequired } = InventoryCodes[inventoryCode];

      return inventoryObjects.every((object) =>
        fieldsRequired.every((requiredField) =>
          Object.keys(object).includes(requiredField)
        )
      );
    },
    () => ({
      message: 'One of the inventory object does not have required fields',
      path: ['inventoryObjects']
    })
  )
  .refine(
    ({ inventoryObjects, inventoryCode }) => {
      const { fields } = InventoryCodes[inventoryCode];

      return inventoryObjects.every((object) =>
        Object.keys(object).every((field) => fields.includes(field))
      );
    },
    ({ inventoryCode }) => ({
      message: `One of the inventory object does not match the list of fields of the form with the code ${inventoryCode}`,
      path: ['inventoryObjects']
    })
  );

export type CreateInventoryData = z.infer<typeof CreateInventorySchema>;
