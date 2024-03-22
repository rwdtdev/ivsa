import { ISO_DATETIME_FORMAT } from '@/constants/date';
import moment, { Moment } from 'moment';

export const toUTCDatetime = (date: Date | Moment) =>
  moment(date).utc().format(ISO_DATETIME_FORMAT).concat('Z');
