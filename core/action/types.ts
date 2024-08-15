import { SortOrder } from '@/constants/data';
import { Action, ActionStatus, ActionType } from '@prisma/client';

export type ActionCreateData = Pick<Action, 'type' | 'status' | 'initiator' | 'ip'> & {
  details?: Record<string, any>;
};

export type ActionsReqParams = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  filter: {
    from?: string;
    to?: string;
    statuses?: ActionStatus[];
    types?: ActionType[];
  };
}> & {
  sort: {
    by: 'actionAt';
    direction: SortOrder;
  };
};
