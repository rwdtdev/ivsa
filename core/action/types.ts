import { SortOrder } from '@/constants/data';
import { monitoringDetailMapper } from '@/constants/mappings/monitoring-detail-mapper';
import { Action, ActionStatus, ActionType } from '@prisma/client';

export type MonitoringDetails = Partial<Record<keyof typeof monitoringDetailMapper, any>>;

export type ActionCreateData = Pick<Action, 'type' | 'status' | 'initiator' | 'ip'> & {
  details?: MonitoringDetails;
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
