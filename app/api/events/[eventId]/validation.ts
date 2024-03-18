import { z } from 'zod';

const eventIdSchema = z.string().trim().min(1).cuid();

export const RemoveEventPathParamsSchema = z.object({ eventId: eventIdSchema });

export const UpdateEventPathParamsSchema = z.object({ eventId: eventIdSchema });

const ParticipantSchema = z
  .object({
    tabelNumber: z.string().trim().length(8),
    roleId: z.string().trim().min(1)
  })
  .strict();

export const ParticipantsSchema = z.array(ParticipantSchema).min(1);

export type ParticipantsData = Array<{
  tabelNumber: string;
  roleId: string;
  userId?: string;
}>;

export const UpdateEventSchema = z
  .object({
    commandId: z.string().trim().min(1).uuid(),
    commandNumber: z.string().trim().min(1),
    commandDate: z.string().trim().min(1).datetime(),
    orderId: z.string().trim().min(1).uuid(),
    orderNumber: z.string().trim().min(1),
    orderDate: z.string().trim().min(1).datetime(),
    auditStart: z.string().trim().min(1).datetime(),
    auditEnd: z.string().trim().min(1).datetime(),
    balanceUnit: z.string().trim().min(1),
    balanceUnitRegionCode: z.string().trim().min(1),
    participants: z.array(ParticipantSchema)
  })
  .strict()
  .partial();

export type UpdateEventData = z.infer<typeof UpdateEventSchema>;
