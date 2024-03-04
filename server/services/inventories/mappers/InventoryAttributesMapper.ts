import { InventoryCode } from '../types';

export const mapToInventoryAttributes = (code: string, data: any) => {
  const attributes: any = {};

  switch (code) {
    // INV-1
    case InventoryCode.I01A01:
      attributes.account = data.SCHET_SUBSCHET || null;
      attributes.sbbCode = data.CSBB || null;
      attributes.name = data.NAME;
      attributes.location = data.LOCATION;
      attributes.termLease = data.TERM_LEASE || null;
      attributes.docName = data.DOCNAME || null;
      attributes.docDate = data.DOCDATE || null;
      attributes.docId = data.DOCID || null;
      attributes.releaseYear = data.BUILDBUY_YEAR || null;
      attributes.inventoryNumber = data.INVNUMBER;
      attributes.serialNumber = data.FACTORYNUMBER;
      attributes.networkNumber = data.NETWORK_NUM;
      attributes.passportNumber = data.PASSPORTNUM;
      attributes.quantity = data.BU_KOL;
      attributes.objectState = data.OBJECT_STATE;
      attributes.docUnusName = data.DOC_UNUS_NAME || null;
      attributes.docUnusDate = data.DOC_UNUS_DATE || null;
      attributes.docUnusId = data.DOC_UNUS_ID || null;
      break;

    // INV-3
    case InventoryCode.I02001:
    case InventoryCode.I02A02:
      attributes.account = data.SCHET_SUBSCHET || null;
      attributes.sbbCode = data.CSBB || null;
      attributes.name = data.NAME;
      attributes.nomenclatureNumber = data.CODE;
      attributes.unitCode = data.EIID;
      attributes.unitName = data.EINAME;
      attributes.price = data.PRICE || null;
      attributes.inventoryNumber = data.INVNUMBER;
      attributes.passportNumber = data.PASSPORTNUM;
      attributes.batchNumber = data.BATCH;
      attributes.quantity = data.BU_KOL;
      break;

    // INV-5
    case InventoryCode.I02F01:
    case InventoryCode.I02F02:
    case InventoryCode.I02F03:
    case InventoryCode.I02F04:
      attributes.account = data.SCHET_SUBSCHET || null;
      attributes.sbbCode = data.CSBB || null;
      attributes.buyerName = data.BUYER_NAME || null;
      attributes.buyerOkpo = data.BUYER_OKPO || null;
      attributes.name = data.NAME;
      attributes.nomenclatureNumber = data.CODE;
      attributes.serialNumber = data.FACTORYNUMBER;
      attributes.placement = data.PLACEMENT;
      attributes.acceptanceDate = data.OTVXRANENIE_DATE || null;
      attributes.docName = data.DOCNAME || null;
      attributes.docId = data.DOCID || null;
      attributes.docDate = data.DOCDATE || null;
      attributes.unitCode = data.EIID;
      attributes.unitName = data.EINAME;
      attributes.batchNumber = data.BATCH;
      attributes.quantity = data.BU_KOL;
      break;

    // FNU-49
    case InventoryCode.I01011:
      attributes.account = data.SCHET_SUBSCHET || null;
      attributes.sbbCode = data.CSBB || null;
      attributes.name = data.NAME;
      attributes.nomenclatureNumber = data.NOMNUMBER;
      attributes.inventoryNumber = data.INVNUMBER;
      attributes.serialNumber = data.FACTORYNUMBER;
      attributes.quantity = data.BU_KOL;
      break;

    // FNU-50
    case InventoryCode.I02G01:
    case InventoryCode.I02G02:
      attributes.account = data.SCHET_SUBSCHET || null;
      attributes.sbbCode = data.CSBB || null;
      attributes.name = data.NAME;
      attributes.nomenclatureNumber = data.NOMNUMBER;
      attributes.inventoryNumber = data.INVNUMBER;
      attributes.serialNumber = data.FACTORYNUMBER;
      attributes.unitCode = data.EIID;
      attributes.unitName = data.EINAME;
      attributes.price = data.PRICE || null;
      attributes.quantity = data.BU_KOL;
      break;

    // FNU-55
    case InventoryCode.I02011:
    case InventoryCode.I02G11:
    case InventoryCode.I02G22:
      attributes.account = data.SCHET_SUBSCHET || null;
      attributes.sbbCode = data.CSBB || null;
      attributes.fio = data.FIO || null;
      attributes.tabelNumber = data.TABNUMBER || null;
      attributes.name = data.NAME;
      attributes.nomenclatureNumber = data.CODE;
      attributes.unitCode = data.EIID;
      attributes.unitName = data.EINAME;
      attributes.price = data.PRICE || null;
      attributes.batchNumber = data.BATCH;
      attributes.quantity = data.BU_KOL;
      break;

    default:
      throw new Error(`Inventory code ${code} is undefined`);
  }

  return attributes;
};
