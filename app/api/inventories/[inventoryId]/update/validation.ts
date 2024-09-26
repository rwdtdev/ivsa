import { z } from 'zod';
import { InventoryCode, InventoryCodes } from '@/core/inventory/types';

const isoDatetimeSchema = z
  .string()
  .min(1)
  .transform((date) => new Date(date).toISOString());

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

const partialInventoryDataSchema = z
  .object({
    inventoryCode: z.nativeEnum(InventoryCode),
    inventoryDate: isoDatetimeSchema,
    inventoryNumber: z.string().trim().min(1),
    inventoryObjects: z.array(inventoryObjectSchema)
  })
  .strict();

export const UpdateInventorySchema = z
  .object({ eventId: z.string().trim().min(1).uuid() })
  .merge(partialInventoryDataSchema.partial())
  .superRefine((data, ctx) => {
    if (data.inventoryCode && data.inventoryObjects) {
      const { fieldsRequired } = InventoryCodes[data.inventoryCode];

      const invalidRequiredIndexes: number[] = [];
      const isContaintRequiredFields = data.inventoryObjects.every((object, idx) =>
        fieldsRequired.every((requiredField) => {
          if (!Object.keys(object).includes(requiredField)) {
            invalidRequiredIndexes.push(idx);
            return false;
          }
          return true;
        })
      );

      if (!isContaintRequiredFields && invalidRequiredIndexes.length > 0) {
        invalidRequiredIndexes.forEach((index) => {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Inventory object does not have required fields.`,
            path: ['inventoryObjects', index]
          });
        });
      }

      const { fields } = InventoryCodes[data.inventoryCode];

      const invalidIndexes: number[] = [];
      const isContainValidFormFields = data.inventoryObjects.every((object, idx) =>
        Object.keys(object).every((field) => {
          if (!fields.includes(field)) {
            invalidIndexes.push(idx);
            return false;
          }
          return true;
        })
      );

      if (!isContainValidFormFields && invalidIndexes.length > 0) {
        invalidIndexes.forEach((index) => {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Inventory object does not match the list of fields of the form with the code ${data.inventoryCode}.`,
            path: ['inventoryObjects', index]
          });
        });
      }
    }
  });

export type UpdateInventoryData = z.infer<typeof UpdateInventorySchema>;

export const UpdateInventoryPathParamsSchema = z.object({
  inventoryId: z.string().trim().min(1)
});

export type UpdateInventoryPathParamsData = z.infer<
  typeof UpdateInventoryPathParamsSchema
>;
