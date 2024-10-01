import { monitoringDetailMapper } from '@/constants/mappings/monitoring-detail-mapper';
import { ActionStatus, ActionType, Prisma } from '@prisma/client';
import { JsonObject, JsonValue } from '@prisma/client/runtime/library';
import { format } from 'date-fns';
import * as ExcelJS from 'exceljs';
import FileSaver from 'file-saver';

type Data = {
  id: string;
  requestId: string | null;
  actionAt: Date;
  type: ActionType;
  status: ActionStatus;
  initiator: string;
  ip: string | null;
  details: Prisma.JsonValue | null;
}[];

export async function exportMonitoringToXlsx(data: Data) {
  const workbook = new ExcelJS.Workbook();

  workbook.views = [
    {
      x: 0,
      y: 0,
      width: 10000,
      height: 20000,
      firstSheet: 0,
      activeTab: 1,
      visibility: 'visible'
    }
  ];

  const worksheet = workbook.addWorksheet('Журнал событий');

  worksheet.columns = [
    { header: 'Дата Время', key: 'dateTime', width: 20 },
    { header: 'IP', key: 'ip', width: 20 },
    { header: 'Инициатор', key: 'initiator', width: 30 },
    {
      header: 'Подробности',
      key: 'details',
      width: 50,
      style: { alignment: { wrapText: true } }
    }
  ];

  data.forEach((item) => {
    worksheet.addRow({
      dateTime: format(item.actionAt, 'dd.MM.yyyy HH:mm'),
      ip: item.ip,
      initiator: item.initiator,
      details: objToString(item.details)
    });
  });

  workbook.xlsx
    .writeBuffer()
    .then((buffer) =>
      FileSaver.saveAs(new Blob([buffer]), `Мониторинг событий ${Date.now()}.xlsx`)
    )
    .catch((err) => console.log('Error writing excel export', err));
}

function objToString(obj2: JsonValue) {
  if (!obj2) return;
  const obj = obj2 as JsonObject;
  const keys = Object.keys(obj) as Array<keyof typeof monitoringDetailMapper>;

  const res: string[] = keys.map((key) => {
    const objKey = obj[key];

    if (Array.isArray(objKey)) {
      return `${monitoringDetailMapper[key]}:
          ${objKey.join(', ')}`;
    } else if (typeof objKey === 'object') {
      return `${monitoringDetailMapper[key]}:` + objToString(objKey);
    } else {
      return `${monitoringDetailMapper[key]}: ${objKey}`;
    }
  });
  return res.join(',\n');
}
