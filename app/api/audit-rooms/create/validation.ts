import { z } from 'zod';
import _ from 'underscore';
import { InventoryCode, InventoryCodes } from '@/server/services/inventories/types';

const [firstKey, ...otherKeys] = _.keys(InventoryCodes);

export const CreateInventorySchema = z
  .object({
    eventId: z.string().min(1),
    inventoryId: z.string().min(1),
    inventoryName: z.string().min(1),
    inventoryCode: z.enum([firstKey, ...otherKeys]),
    inventoryDate: z.string().datetime().min(1),
    inventoryNumber: z.string().min(1),
    inventoryShortName: z.string().min(1),
    inventoryContainerObject: z
      .object({
        SCHET_SUSCHET: z.string().optional(),
        CSBB: z.string().optional(),
        BUYER_NAME: z.string().optional(),
        BUYER_OKPO: z.string().optional(),
        NAME: z.string().optional(),
        CODE: z.string().optional(),
        FACTORYNUMBER: z.string().optional(),
        PLACEMENT: z.string().optional(),
        OTVXRANENIE_DATE: z.string().datetime().optional(),
        DOCNAME: z.string().optional(),
        DOCID: z.string().optional(),
        DOCDATE: z.string().datetime().optional(),
        EIID: z.string().optional(),
        EINAME: z.string().optional(),
        BATCH: z.string().optional(),
        BU_KOL: z.number().optional(),
        NOMNUMBER: z.number().optional(),
        INVNUMBER: z.string().optional(),
        PRICE: z.number().optional(),
        FIO: z.string().optional(),
        TABNUMBER: z.string().optional()
      })
      .refine((inventoryAttributes) => !_.isEmpty(inventoryAttributes), {
        message: 'Can not be empty'
      })
  })
  .refine(
    ({ inventoryContainerObject, inventoryCode }) => {
      const { fields } = InventoryCodes[inventoryCode as InventoryCode];

      return fields.every((field) =>
        Object.keys(inventoryContainerObject).includes(field)
      );
    },
    ({ inventoryCode }) => ({
      message: `The fields composition in 'inventoryContainerObject' does not match the list of fields of the form with the code ${inventoryCode}`,
      path: ['inventoryContainerObject']
    })
  );

export type CreateInventoryData = z.infer<typeof CreateInventorySchema>;
