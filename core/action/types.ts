import { Action } from '@prisma/client';

export type ActionCreateData = Pick<Action, 'type' | 'status' | 'initiator' | 'ip'> & {
  details?: Record<string, any>;
};
