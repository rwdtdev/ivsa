import { UserStatus } from '@prisma/client';
import { toUTCDatetime } from './dates';
import { ParticipantWithUser } from '@/core/event/types';

export const getRegisteredParticipants = (participants: ParticipantWithUser[]) => {
  return participants
    .filter(({ user }) => user)
    .map(({ user }) => ({
      tabelNumber: user.tabelNumber,
      expiresAt: toUTCDatetime(user.expiresAt),
      isRecused: user.status === UserStatus.RECUSED,
      isBlocked:
        user.status === UserStatus.BLOCKED || user.expiresAt.getTime() < Date.now()
    }));
};
