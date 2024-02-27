import { UserRole } from '@prisma/client';

export const IvaRoles = {
  SPEAKER: 'SPEAKER',
  MODERATOR: 'MODERATOR',
  ATTENDEE: 'ATTENDEE'
};

export const IvaRolesMapper: { [key in UserRole]: string } = {
  [UserRole.CHAIRMAN]: IvaRoles.SPEAKER,
  [UserRole.INSPECTOR]: IvaRoles.MODERATOR,
  [UserRole.ACCOUNTANT]: IvaRoles.ATTENDEE,
  [UserRole.ACCOUNTANT_ACCEPTOR]: IvaRoles.ATTENDEE,
  [UserRole.ENGINEER]: IvaRoles.ATTENDEE,
  [UserRole.FINANCIALLY_RESPONSIBLE_PERSON]: IvaRoles.ATTENDEE,
  [UserRole.MANAGER]: IvaRoles.ATTENDEE,
  [UserRole.PARTICIPANT]: IvaRoles.ATTENDEE,
  [UserRole.USER]: IvaRoles.ATTENDEE,
  [UserRole.ADMIN]: IvaRoles.ATTENDEE
};
