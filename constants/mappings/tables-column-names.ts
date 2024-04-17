export const UsersTableColumnNames = {
  name: 'ФИО',
  username: 'Логин',
  email: 'Эл. почта',
  phone: 'Телефон',
  role: 'Роли',
  status: 'Статус',
  tabelNumber: 'Табельный номер',
  organisation: 'Организация',
  department: 'Отдел'
};

export const EventsTableColumnNames = {
  commandId: 'Распоряжение',
  commandNumber: 'Номер распоряжения',
  commandDate: 'Дата распоряжения',
  orderId: 'Приказ',
  status: 'Статус',
  briefingStatus: 'Инструктаж',
  orderNumber: 'Номер приказа',
  orderDate: 'Дата составления приказа',
  startAt: 'Дата начала Реестр инвентаризаций',
  endAt: 'Дата окончания Реестр инвентаризаций',
  balanceUnit: 'Балансовая единица',
  balanceUnitRegionCode: 'Код региона',
  participants: 'Участники'
};

export const InventoryObjectsTableColumnNames = {
  inventoryNumber: 'Инв. номер',
  location: 'Локация',
  serialNumber: 'Серийный номер',
  networkNumber: 'Сетевой номер',
  passportNumber: 'Номер паспорта',
  quantity: 'Количество',
  state: 'Состояние',
  name: 'Наименование',
  unitCode: 'Код ед. измерения',
  unitName: 'Единица измерения',
  batchNumber: 'Номер партии',
  placement: 'Местоположение'
};

export const makeColumnsNames =
  <T>(columnNames: T) =>
  (columnId: string) =>
    columnNames[columnId as keyof typeof columnNames];
