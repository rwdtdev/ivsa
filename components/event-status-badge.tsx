import { EventStatuses } from '@/constants/mappings/prisma-enums';
import { EventStatus } from '@prisma/client';
import { Badge } from './ui/badge';
import {
  StopwatchIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  CircleIcon
} from '@radix-ui/react-icons';

type EventStatusBadgeProps = {
  status?: EventStatus;
};

export const EventStatusBadge = ({ status }: EventStatusBadgeProps) => {
  if (!status) return null;

  const mappedStatus = EventStatuses[status];

  if (status === EventStatus.REMOVED) {
    return (
      <Badge
        variant='secondary'
        className='pointer-events-none bg-red-200 py-1 hover:bg-red-200'
      >
        <CrossCircledIcon className='mr-1' /> {mappedStatus}
      </Badge>
    );
  }

  if (status === EventStatus.IN_PROGRESS) {
    return (
      <Badge
        variant='secondary'
        className='pointer-events-none bg-blue-200 py-1 hover:bg-blue-200'
      >
        <StopwatchIcon className='mr-1' /> {mappedStatus}
      </Badge>
    );
  }

  if (status === EventStatus.NOT_STARTED || status === EventStatus.OPEN) {
    return (
      <Badge
        variant='secondary'
        className='pointer-events-none bg-gray-200 py-1 hover:bg-gray-200'
      >
        <CircleIcon className='mr-1' /> {mappedStatus}
      </Badge>
    );
  }

  if (status === EventStatus.CLOSED || status === EventStatus.PASSED) {
    return (
      <Badge
        variant='secondary'
        className='pointer-events-none bg-green-200 py-1 hover:bg-green-200'
      >
        <CheckCircledIcon className='mr-1' /> {mappedStatus}
      </Badge>
    );
  }
};
