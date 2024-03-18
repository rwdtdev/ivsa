import { z } from 'zod';

const isoDatetimeSchema = z
  .string()
  .min(1)
  .transform((date) => new Date(date).toISOString());

const participantSchema = z
  .object({
    tabelNumber: z.string().trim().length(8),
    roleId: z.string().trim().min(1)
  })
  .strict();

export const CreateEventSchema = z
  .object({
    commandId: z.string().trim().min(1),
    commandNumber: z.string().trim().min(1),
    commandDate: isoDatetimeSchema,
    orderId: z.string().trim().min(1),
    orderNumber: z.string().trim().min(1),
    orderDate: isoDatetimeSchema,
    auditStart: isoDatetimeSchema,
    auditEnd: isoDatetimeSchema,
    balanceUnit: z.string().trim().min(1),
    balanceUnitRegionCode: z.string().trim().min(1),
    participants: z.array(participantSchema)
  })
  .strict();

export type CreateEventData = z.infer<typeof CreateEventSchema>;
