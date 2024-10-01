import { cn } from '@/lib/utils';
import { BriefingStatus, EventStatus, InventoryStatus } from '@prisma/client';
import {
  BriefingStatuses,
  EventStatuses,
  InventoryStatuses
} from '@/constants/mappings/prisma-enums';
import { Badge } from './ui/badge';
import {
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  StopwatchIcon
} from '@radix-ui/react-icons';

export const EventStatusBadge = ({ status }: { status?: EventStatus }) => {
  if (!status) return null;

  const text = EventStatuses[status];

  let Icon = null;
  let classNames = 'bg-gray-200 hover:bg-gray-200';

  if (status === EventStatus.REMOVED) {
    Icon = CrossCircledIcon;
    classNames = 'bg-red-200 hover:bg-red-200';
  }

  return (
    <Badge variant='secondary' className={cn('pointer-events-none py-1', classNames)}>
      {Icon && <Icon className='mr-1' />} {text}
    </Badge>
  );
};

export const InventoryStatusBadge = ({ status, removedOnly = false }: { status?: InventoryStatus, removedOnly?: boolean}) => {
  if (!status) return null;

  if (removedOnly && status !== InventoryStatus.REMOVED) return null;

  const text = InventoryStatuses[status];

  let classNames = 'bg-gray-200 hover:bg-gray-200';

  if (status === InventoryStatus.REMOVED) {
    classNames = 'bg-red-200 hover:bg-red-200';
  }

  return (
    <Badge variant='secondary' className={cn('pointer-events-none py-1', classNames)}>
      {text}
    </Badge>
  );
};

export const BriefingStatusBadge = ({ status }: { status?: BriefingStatus }) => {
  if (!status) return null;

  const text = BriefingStatuses[status];

  let Icon = CircleIcon;
  let classNames = 'bg-gray-200 hover:bg-gray-200';

  if (status === BriefingStatus.IN_PROGRESS) {
    Icon = StopwatchIcon;
    classNames = 'bg-blue-200 hover:bg-blue-200';
  }

  if (status === BriefingStatus.PASSED) {
    Icon = CheckCircledIcon;
    classNames = 'bg-green-200 hover:bg-green-200';
  }

  return (
    <Badge variant='secondary' className={cn('pointer-events-none py-1', classNames)}>
      <Icon className='mr-1' /> {text}
    </Badge>
  );
};
