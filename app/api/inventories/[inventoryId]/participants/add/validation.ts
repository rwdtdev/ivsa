import { SoiParticipantRolesEnum } from '@/constants/mappings/soi';
import { z } from 'zod';

const participantSchema = z.object({
  tabelNumber: z.string().trim().length(8),
  roleId: z.enum([SoiParticipantRolesEnum.ACCOUNTANT, SoiParticipantRolesEnum.INSPECTOR])
});

export const UpdateInventorySchema = z.object({
  eventId: z.string().trim().min(1).cuid(),
  participants: z.array(participantSchema).nonempty()
});

export type UpdateInventoryData = z.infer<typeof UpdateInventorySchema>;

export const PathParamsSchema = z.object({
  inventoryId: z.string().trim().min(1)
});
