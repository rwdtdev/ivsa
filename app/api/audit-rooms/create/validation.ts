import { z } from 'zod';
import { InventoryCode, InventoryCodes } from '@/server/services/inventories/types';

export const CreateInventorySchema = z
  .object({
    eventId: z.string().min(1),
    inventoryId: z.string().min(1),
    inventoryName: z.string().min(1),
    inventoryCode: z.nativeEnum(InventoryCode),
    inventoryDate: z.string().datetime().min(1),
    inventoryNumber: z.string().min(1),
    inventoryShortName: z.string().min(1),
    inventoryContainerObject: z
      .object({
        SCHET_SUSCHET: z.string(),
        CSBB: z.string(),
        BUYER_NAME: z.string(),
        BUYER_OKPO: z.string(),
        NAME: z.string(),
        CODE: z.string(),
        FACTORYNUMBER: z.string(),
        PLACEMENT: z.string(),
        TERM_LEASE: z.string().datetime(),
        OTVXRANENIE_DATE: z.string().datetime(),
        DOCNAME: z.string().optional(),
        DOCID: z.string().optional(),
        DOCDATE: z.string().datetime(),
        EIID: z.string(),
        NETWORK_NUM: z.string(),
        PASSPORTNUM: z.string(),
        EINAME: z.string(),
        LOCATION: z.string(),
        BATCH: z.string(),
        OBJECT_STATE: z.string(),
        BU_KOL: z.number(),
        NOMNUMBER: z.number(),
        BUILDBUY_YEAR: z.string().datetime(),
        INVNUMBER: z.string(),
        PRICE: z.number(),
        FIO: z.string(),
        TABNUMBER: z.string(),
        DOC_UNUS_NAME: z.string(),
        DOC_UNUS_DATE: z.string(),
        DOC_UNUS_ID: z.string()
      })
      .partial()
  })
  .strict()
  .refine(
    ({ inventoryContainerObject, inventoryCode }) => {
      const { fields } = InventoryCodes[inventoryCode];

      return Object.keys(inventoryContainerObject).every((field) =>
        fields.includes(field)
      );
    },
    ({ inventoryCode }) => ({
      message: `The fields composition in 'inventoryContainerObject' does not match the list of fields of the form with the code ${inventoryCode}`,
      path: ['inventoryContainerObject']
    })
  );

export type CreateInventoryData = z.infer<typeof CreateInventorySchema>;
