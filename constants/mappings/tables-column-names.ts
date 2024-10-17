export const UsersTableColumnNames = {
  name: 'ФИО',
  username: 'Логин',
  email: 'Эл. почта',
  phone: 'Телефон',
  role: 'Роли',
  status: 'Статус',
  tabelNumber: 'Табельный номер',
  organisation: 'Организация',
  department: 'Отдел',
  expiresAt: 'Действует до',
  ASOZSystemRequestNumber: 'Номер заявки в АС ОЗ'
};

export const EventsTableColumnNames = {
  commandId: 'Распоряжение',
  commandNumber: 'Номер распоряжения',
  commandDate: 'Дата распоряжения',
  orderId: 'Приказ',
  status: 'Статус',
  briefingStatus: 'Инструктаж',
  orderNumber: 'Номер приказа',
  orderDate: 'Дата приказа',
  startAt: 'Дата начала инвентаризации',
  endAt: 'Дата окончания инвентаризации',
  balanceUnit: 'Балансовая единица',
  balanceUnitRegionCode: 'Регион',
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
  placement: 'Местоположение',
  videosDate: 'Дата видео',
  onVideoAt: 'Время на\u00A0видео',
  isConditionOk: 'Состояние',
  comments: 'Комментарии'
};

export const SystemEventsTableColumnNames = {
  date: 'Дата',
  time: 'Время',
  actionType: 'Событие',
  name: 'ФИО',
  ip: 'IP'
};

export const makeColumnsNames =
  <T>(columnNames: T) =>
  (columnId: string) =>
    columnNames[columnId as keyof typeof columnNames];
