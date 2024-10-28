import { InventoryObject } from '@prisma/client';
import { format } from 'date-fns';
import * as ExcelJS from 'exceljs';
import FileSaver from 'file-saver';

const maxRows = 1000;

export async function exportInventoryObjectsToXlsx(allData: InventoryObject[]) {
  for (let i = 0; i < Math.ceil(allData.length / maxRows); i++) {
    const data = allData.slice(i * maxRows, i * maxRows + maxRows);

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
      { header: 'Серийный номер', key: 'serialNumber', width: 20 },
      { header: 'Количество', key: 'quantity', width: 15 },
      { header: 'Наименование', key: 'name', width: 40 },
      { header: 'Номер партии', key: 'batchNumber', width: 20 },
      { header: 'Местоположение', key: 'placement', width: 50 },
      { header: 'Дата и время на видео', key: 'timeOnVideo', width: 20 },
      { header: 'Состояние', key: 'condition', width: 30 },
      {
        header: 'Комментарии',
        key: 'comments',
        width: 50,
        style: { alignment: { wrapText: true } }
      }
    ];

    data.forEach((item) => {
      worksheet.addRow({
        serialNumber: item.serialNumber,
        quantity: String(item.quantity) + ' ' + item.unitName,
        name: item.name,
        batchNumber: item.batchNumber,
        timeOnVideo: item.onVideoAt ? format(item.onVideoAt, 'dd.MM.yyyy HH:mm') : '----',
        placement: item.placement,
        condition: item.isConditionOk
          ? 'Исправно'
          : item.isConditionOk === false
            ? 'Неисправно'
            : '----',
        comments: item.comments
      });
    });

    workbook.xlsx
      .writeBuffer()
      .then((buffer) =>
        FileSaver.saveAs(new Blob([buffer]), `Мониторинг событий ${Date.now()}-${i}.xlsx`)
      )
      .catch((err) => console.log('Error writing excel export', err));
  }
}
