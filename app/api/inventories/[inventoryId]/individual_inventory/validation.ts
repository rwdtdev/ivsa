import { z } from 'zod';
import { InventoryCode, InventoryCodes } from '@/core/inventory/types';

const inventoryObjectSchema = z
  .object({
    NAME: z.string().trim(),
    CODE: z.string().trim(),
    LOCATION: z.string().trim(),
    FACTORYNUMBER: z.string().trim(),
    PLACEMENT: z.string().trim(),
    EIID: z.string().trim(),
    NETWORK_NUM: z.string().trim(),
    PASSPORTNUM: z.string().trim(),
    EINAME: z.string().trim(),
    BATCH: z.string().trim(),
    OBJECT_STATE: z.string().trim(),
    BU_KOL: z.number(),
    NOMNUMBER: z.string().trim(),
    INVNUMBER: z.string().trim()
  })
  .partial()
  .strict();

export const CreateIndividualInventorySchema = z
  .object({
    eventId: z.string().trim().min(1).cuid(),
    individualInventoryId: z.string().trim().min(1),
    inventoryCode: z.nativeEnum(InventoryCode),
    inventoryDate: z.string().trim().datetime().optional().nullable(),
    inventoryNumber: z.string().trim().min(1),
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
      message: 'One of the individual inventory object does not have required fields',
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
      message: `One of the individual inventory object does not match the list of fields of the form with the code ${inventoryCode}`,
      path: ['inventoryObjects']
    })
  );

export type CreateIndividualInventoryData = z.infer<
  typeof CreateIndividualInventorySchema
> & { id: string };

export const PathParamsSchema = z.object({
  inventoryId: z.string().trim().min(1)
});

export const RemoveIndividualInvenoryPathParamsSchema = z.object({
  inventoryId: z.string().trim().min(1)
});

export const RemoveIndividualInvenoryQueryParamsSchema = z.object({
  eventId: z.string().trim().min(1).cuid(),
  complexInventoryId: z.string().trim().min(1)
});
