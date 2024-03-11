import { UserRole } from '@prisma/client';

export const SoiParticipantRoles = {
  '01': UserRole.CHAIRMAN,
  '02': UserRole.PARTICIPANT,
  '04': UserRole.FINANCIALLY_RESPONSIBLE_PERSON,
  '05': UserRole.INSPECTOR,
  '06': UserRole.ACCOUNTANT,
  '07': UserRole.MANAGER
};

export type SoiParticipantRole = keyof typeof SoiParticipantRoles;
