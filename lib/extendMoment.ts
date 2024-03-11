import * as moment from 'moment';
import momentRange from 'moment-range';

import('moment-timezone');

moment.locale('ru');
momentRange.extendMoment(moment);
