import { ParticipantRole } from '@prisma/client';

export const SoiParticipantRoles = {
  '01': ParticipantRole.CHAIRMAN,
  '02': ParticipantRole.PARTICIPANT,
  '04': ParticipantRole.FINANCIALLY_RESPONSIBLE_PERSON,
  '05': ParticipantRole.INSPECTOR,
  '06': ParticipantRole.ACCOUNTANT,
  '07': ParticipantRole.MANAGER
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
