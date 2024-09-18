import { ParticipantRole } from '@prisma/client';

export const IvaRoles = {
  SPEAKER: 'SPEAKER',
  MODERATOR: 'MODERATOR',
  ATTENDEE: 'ATTENDEE'
};

export const IvaRolesMapper: { [key in ParticipantRole]: string } = {
  [ParticipantRole.CHAIRMAN]: IvaRoles.MODERATOR,
  [ParticipantRole.INSPECTOR]: IvaRoles.MODERATOR,
  [ParticipantRole.ACCOUNTANT]: IvaRoles.ATTENDEE,
  [ParticipantRole.ACCOUNTANT_ACCEPTOR]: IvaRoles.ATTENDEE,
  [ParticipantRole.ENGINEER]: IvaRoles.ATTENDEE,
  [ParticipantRole.FINANCIALLY_RESPONSIBLE_PERSON]: IvaRoles.ATTENDEE,
  [ParticipantRole.MANAGER]: IvaRoles.ATTENDEE,
  [ParticipantRole.PARTICIPANT]: IvaRoles.ATTENDEE
};
