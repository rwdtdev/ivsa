import { UserRole } from '@prisma/client';

export const SoiParticipantRoles = {
  '01': UserRole.CHAIRMAN,
  '02': UserRole.PARTICIPANT,
  '04': UserRole.FINANCIALLY_RESPONSIBLE_PERSON,
  '05': UserRole.INSPECTOR,
  '06': UserRole.ACCOUNTANT,
  '07': UserRole.MANAGER
};

export enum SoiParticipantRolesEnum {
  CHAIRMAN = '01',
  PARTICIPANT = '02',
  FINANCIALLY_RESPONSIBLE_PERSON = '04',
  INSPECTOR = '05',
  ACCOUNTANT = '06',
  MANAGE = '07'
}

export type SoiParticipantRole = keyof typeof SoiParticipantRoles;
