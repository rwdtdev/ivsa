import { Participant } from '@prisma/client';

export type ParticipantCreateData = Omit<Participant, 'createdAt' | 'updatedAt' | 'id'>;

export type ParticipantCreateManyData = Partial<ParticipantCreateData>[];
