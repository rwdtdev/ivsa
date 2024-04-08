import { Inventory } from '@prisma/client';

export type Inv1Form = {
  account: string;
  sbbCode: string;
  name: string;
  location: string;
  termLease: Date;
  docName: string;
  docDate: Date;
  docId: string;
  releaseYear: number;
  inventoryNumber: string;
  serialNumber: string;
  networkNumber: string;
  passportNumber: string;
  quantity: number;
  objectState: string;
  docUnusName: string;
  docUnusDate: Date;
  docUnusId: string;
};

export type Inv3Form = {
  account: string;
  sbbCode: string;
  name: string;
  nomenclatureNumber: string;
  unitCode: string;
  unitName: string;
  price: number;
  inventoryNumber: string;
  passportNumber: string;
  batchNumber: string;
  quantity: number;
};

export type Inv5Form = {
  account: string;
  sbbCode: string;
  buyerName: string;
  buyerOkpo: string;
  name: string;
  nomenclatureNumber: string;
  serialNumber: string;
  placement: string;
  acceptanceDate: Date;
  docName: string;
  docId: string;
  docDate: Date;
  unitCode: string;
  unitName: string;
  batchNumber: string;
  quantity: number;
};

export type Fnu49Form = {
  account: string;
  sbbCode: string;
  name: string;
  nomenclatureNumber: string;
  inventoryNumber: string;
  serialNumber: string;
  quantity: number;
};

export type Fnu50Form = {
  account: string;
  sbbCode: string;
  name: string;
  nomenclatureNumber: string;
  inventoryNumber: string;
  serialNumber: string;
  quantity: number;
  unitCode: string;
  unitName: string;
  price: number;
};

export type Fnu55Form = {
  account: string;
  sbbCode: string;
  name: string;
  quantity: number;
  unitCode: string;
  unitName: string;
  price: number;
  fio: string;
  tabelNumber: string;
  nomenclatureNumber: string;
};

export type InventoryContainerObject =
  | Inv1Form
  | Inv3Form
  | Inv5Form
  | Fnu49Form
  | Fnu50Form
  | Fnu55Form;

export type InventoryCreateData = Omit<
  Inventory,
  | 'auditSessionId'
  | 'auditRoomInviteLink'
  | 'createdAt'
  | 'updatedAt'
  | 'participants'
  | 'videoFiles'
  | 'parentId'
  | 'status'
  | 'isFilesSaved'
  | 'videoFilesUrls'
> & {
  parentId?: string;
};

/* eslint-disable */
export enum InventoryCode {
  I01A01 = 'I01A01',
  I02001 = 'I02001',
  I02A02 = 'I02A02',
  I02F01 = 'I02F01',
  I02F02 = 'I02F02',
  I02F03 = 'I02F03',
  I02F04 = 'I02F04',
  I01011 = 'I01011',
  I02G01 = 'I02G01',
  I02G02 = 'I02G02',
  I02011 = 'I02011',
  I02G11 = 'I02G11',
  I02G22 = 'I02G22'
}
/* eslint-enable */

const Inv3Fields = [
  'NAME',
  'CODE',
  'EIID',
  'EINAME',
  'INVNUMBER',
  'PASSPORTNUM',
  'BATCH',
  'BU_KOL'
];
const Inv3FieldsRequired = ['NAME', 'CODE', 'EIID', 'EINAME'];

const Inv5Fields = [
  'NAME',
  'CODE',
  'FACTORYNUMBER',
  'PLACEMENT',
  'EIID',
  'EINAME',
  'BATCH',
  'BU_KOL'
];
const Inv5FieldsRequired = ['NAME', 'CODE', 'EIID', 'EINAME'];

const Fnu50Fields = [
  'NAME',
  'NOMNUMBER',
  'INVNUMBER',
  'FACTORYNUMBER',
  'EIID',
  'EINAME',
  'BU_KOL'
];
const Fnu50FieldsRequired = ['NAME', 'NOMNUMBER', 'EIID', 'EINAME'];

const Fnu55Fields = ['NAME', 'CODE', 'EIID', 'EINAME', 'BATCH', 'BU_KOL'];
const Fnu55FieldsRequired = ['NAME', 'CODE', 'EIID', 'EINAME'];

export const InventoryCodes = {
  [InventoryCode.I01A01]: {
    name: 'Инвентаризационная опись основных средств (кроме зданий и сооруж., зем. участков, об-тов природопольз-я, груз. вагонов)',
    shortName: 'ИНВ-1 (ОС)',
    fields: [
      'NAME',
      'LOCATION',
      'INVNUMBER',
      'FACTORYNUMBER',
      'NETWORK_NUM',
      'PASSPORTNUM',
      'BU_KOL',
      'OBJECT_STATE'
    ],
    fieldsRequired: ['NAME']
  },
  [InventoryCode.I02001]: {
    name: 'Инвентаризационная опись товарно-материальных ценностей',
    shortName: 'ИНВ-3',
    fields: Inv3Fields,
    fieldsRequired: Inv3FieldsRequired
  },
  [InventoryCode.I02A02]: {
    name: 'Инвентаризационная опись товарно-материальных ценностей (оборудование к установке)',
    shortName: 'ИНВ-3 (ОУ)',
    fields: Inv3Fields,
    fieldsRequired: Inv3FieldsRequired
  },
  [InventoryCode.I02F01]: {
    name: 'Инвентаризационная опись товарно-материальных ценностей, принятых на ответ.хранение',
    shortName: 'ИНВ-5 (ОХ)',
    fields: Inv5Fields,
    fieldsRequired: Inv5FieldsRequired
  },
  [InventoryCode.I02F02]: {
    name: 'Инвентаризационная опись товарно-материальных ценностей, принятых на ответ.хранение (Материалы, принятые на переработку)',
    shortName: 'ИНВ-5 (МП)',
    fields: Inv5Fields,
    fieldsRequired: Inv5FieldsRequired
  },
  [InventoryCode.I02F03]: {
    name: 'Инвентаризационная опись товарно-материальных ценностей, принятых на ответ.хранение (Товары, принятые на комиссию)',
    shortName: 'ИНВ-5 (ТК)',
    fields: Inv5Fields,
    fieldsRequired: Inv5FieldsRequired
  },
  [InventoryCode.I02F04]: {
    name: 'Инвентаризационная опись товарно-материальных ценностей, принятых на ответ.хранение (Оборудование, принятое для монтажа)',
    shortName: 'ИНВ-5 (ОМ)',
    fields: Inv5Fields,
    fieldsRequired: Inv5FieldsRequired
  },
  [InventoryCode.I01011]: {
    name: 'Инвентаризационная опись малоценных ОС и иных аналогичных активов, переданных в эксплуатацию (на 013, 023 забал. счетах)',
    shortName: 'ФНУ-49',
    fields: ['NAME', 'NOMNUMBER', 'INVNUMBER', 'FACTORYNUMBER', 'BU_KOL'],
    fieldsRequired: ['NAME', 'INVNUMBER']
  },
  [InventoryCode.I02G01]: {
    name: 'Инвентаризационная опись активов со сроком использования не более 12 месяцев, учитываемых в качестве МПЗ, переданных в производство',
    shortName: 'ФНУ-50 (< 12м.)',
    fields: Fnu50Fields,
    fieldsRequired: Fnu50FieldsRequired
  },
  [InventoryCode.I02G02]: {
    name: 'Инвентаризационная опись активов со сроком использования более 12 месяцев, учитываемых в качестве МПЗ, переданных в производство',
    shortName: 'ФНУ-50 (> 12м.)',
    fields: Fnu50Fields,
    fieldsRequired: Fnu50FieldsRequired
  },
  [InventoryCode.I02011]: {
    name: 'Инвентаризационная опись спецодежды в эксплуатации',
    shortName: 'ФНУ-55',
    fields: Fnu55Fields,
    fieldsRequired: Fnu55FieldsRequired
  },
  [InventoryCode.I02G11]: {
    name: 'Инвентаризационная опись спецодежды в эксплуатации cо сроком использования <12м включая класс 502100',
    shortName: 'ФНУ-55(< 12 вкл)',
    fields: Fnu55Fields,
    fieldsRequired: Fnu55FieldsRequired
  },
  [InventoryCode.I02G22]: {
    name: 'Инвентаризационная опись спецодежды в эксплуатации cо сроком использования <12м.исключая класс 502100 только кл. 502200',
    shortName: 'ФНУ-55(< 12 иск)',
    fields: Fnu55Fields,
    fieldsRequired: Fnu55FieldsRequired
  }
};
