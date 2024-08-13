import { Action } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

export type ActionCreateData = Pick<Action, 'type' | 'status' | 'initiator' | 'ip'> & {
  details?: Record<string, any>;
};
