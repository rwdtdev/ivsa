import { Inventory } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

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
>;

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

export const InventoryCodes = {
  [InventoryCode.I01A01]: {
    name: 'ИНВ-1 (ОС)',
    fields: [
      'SCHET_SUSCHET',
      'CSBB',
      'NAME',
      'LOCATION',
      'TERM_LEASE',
      'DOCNAME',
      'DOCDATE',
      'DOCID',
      'BUILDBUY_YEAR',
      'INVNUMBER',
      'FACTORYNUMBER',
      'NETWORK_NUM',
      'PASSPORTNUM',
      'BU_KOL',
      'OBJECT_STATE',
      'DOC_UNUS_NAME',
      'DOC_UNUS_DATE',
      'DOC_UNUS_ID'
    ]
  },
  [InventoryCode.I02001]: {
    name: 'ИНВ-3',
    fields: [
      'SCHET_SUSCHET',
      'CSBB',
      'FIO',
      'TABNUMBER',
      'NAME',
      'CODE',
      'EIID',
      'EINAME',
      'PRICE',
      'BATCH',
      'BU_KOL'
    ]
  },
  [InventoryCode.I02A02]: {
    name: 'ИНВ-3 (ОУ)',
    fields: [
      'SCHET_SUSCHET',
      'CSBB',
      'FIO',
      'TABNUMBER',
      'NAME',
      'CODE',
      'EIID',
      'EINAME',
      'PRICE',
      'BATCH',
      'BU_KOL'
    ]
  },
  [InventoryCode.I02F01]: {
    name: 'ИНВ-5 (ОХ)',
    fields: [
      'SCHET_SUSCHET',
      'CSBB',
      'BUYER_NAME',
      'BUYER_OKPO',
      'NAME',
      'CODE',
      'FACTORYNUMBER',
      'PLACEMENT',
      'OTVXRANENIE_DATE',
      'DOCNAME',
      'DOCID',
      'DOCDATE',
      'EIID',
      'EINAME',
      'BATCH',
      'BU_KOL'
    ]
  },
  [InventoryCode.I02F02]: {
    name: 'ИНВ-5 (МП)',
    fields: [
      'SCHET_SUSCHET',
      'CSBB',
      'BUYER_NAME',
      'BUYER_OKPO',
      'NAME',
      'CODE',
      'FACTORYNUMBER',
      'PLACEMENT',
      'OTVXRANENIE_DATE',
      'DOCNAME',
      'DOCID',
      'DOCDATE',
      'EIID',
      'EINAME',
      'BATCH',
      'BU_KOL'
    ]
  },
  [InventoryCode.I02F03]: {
    name: 'ИНВ-5 (ТК)',
    fields: [
      'SCHET_SUSCHET',
      'CSBB',
      'BUYER_NAME',
      'BUYER_OKPO',
      'NAME',
      'CODE',
      'FACTORYNUMBER',
      'PLACEMENT',
      'OTVXRANENIE_DATE',
      'DOCNAME',
      'DOCID',
      'DOCDATE',
      'EIID',
      'EINAME',
      'BATCH',
      'BU_KOL'
    ]
  },
  [InventoryCode.I02F04]: {
    name: 'ИНВ-5 (ОМ)',
    fields: [
      'SCHET_SUSCHET',
      'CSBB',
      'BUYER_NAME',
      'BUYER_OKPO',
      'NAME',
      'CODE',
      'FACTORYNUMBER',
      'PLACEMENT',
      'OTVXRANENIE_DATE',
      'DOCNAME',
      'DOCID',
      'DOCDATE',
      'EIID',
      'EINAME',
      'BATCH',
      'BU_KOL'
    ]
  },
  [InventoryCode.I01011]: {
    name: 'ФНУ-49',
    fields: [
      'SCHET_SUSCHET',
      'CSBB',
      'NAME',
      'NOMNUMBER',
      'INVNUMBER',
      'FACTORYNUMBER',
      'BU_KOL'
    ]
  },
  [InventoryCode.I02G01]: {
    name: 'ФНУ-50 (< 12м.)',
    fields: [
      'SCHET_SUSCHET',
      'CSBB',
      'NAME',
      'NOMNUMBER',
      'INVNUMBER',
      'FACTORYNUMBER',
      'BU_KOL',
      'EIID',
      'EINAME',
      'PRICE'
    ]
  },
  [InventoryCode.I02G02]: {
    name: 'ФНУ-50 (> 12м.)',
    fields: [
      'SCHET_SUSCHET',
      'CSBB',
      'NAME',
      'NOMNUMBER',
      'INVNUMBER',
      'FACTORYNUMBER',
      'BU_KOL',
      'EIID',
      'EINAME',
      'PRICE'
    ]
  },
  [InventoryCode.I02011]: {
    name: 'ФНУ-55',
    fields: [
      'SCHET_SUSCHET',
      'CSBB',
      'NAME',
      'BU_KOL',
      'EIID',
      'EINAME',
      'PRICE',
      'FIO',
      'TABNUMBER',
      'CODE'
    ]
  },
  [InventoryCode.I02G11]: {
    name: 'ФНУ-55(< 12 вкл)',
    fields: [
      'SCHET_SUSCHET',
      'CSBB',
      'NAME',
      'BU_KOL',
      'EIID',
      'EINAME',
      'PRICE',
      'FIO',
      'TABNUMBER',
      'CODE'
    ]
  },
  [InventoryCode.I02G22]: {
    name: 'ФНУ-55(< 12 иск)',
    fields: [
      'SCHET_SUSCHET',
      'CSBB',
      'NAME',
      'BU_KOL',
      'EIID',
      'EINAME',
      'PRICE',
      'FIO',
      'TABNUMBER',
      'CODE'
    ]
  }
};
