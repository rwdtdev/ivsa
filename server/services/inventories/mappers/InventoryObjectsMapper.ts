import { InventoryCode } from '../types';

export const mapToInventoryObject = (code: string, data: Record<string, unknown>) => {
  const object: any = {};

  switch (code) {
    // INV-1
    case InventoryCode.I01A01:
      object.name = data.NAME;
      object.location = data.LOCATION;
      object.inventoryNumber = data.INVNUMBER;
      object.serialNumber = data.FACTORYNUMBER;
      object.networkNumber = data.NETWORK_NUM;
      object.passportNumber = data.PASSPORTNUM;
      object.quantity = data.BU_KOL;
      object.state = data.OBJECT_STATE;
      break;

    // INV-3
    case InventoryCode.I02001:
    case InventoryCode.I02A02:
      object.name = data.NAME;
      object.nomenclatureNumber = data.CODE;
      object.unitCode = data.EIID;
      object.unitName = data.EINAME;
      object.inventoryNumber = data.INVNUMBER;
      object.passportNumber = data.PASSPORTNUM;
      object.batchNumber = data.BATCH;
      object.quantity = data.BU_KOL;
      break;

    // INV-5
    case InventoryCode.I02F01:
    case InventoryCode.I02F02:
    case InventoryCode.I02F03:
    case InventoryCode.I02F04:
      object.name = data.NAME;
      object.nomenclatureNumber = data.CODE;
      object.serialNumber = data.FACTORYNUMBER;
      object.placement = data.PLACEMENT;
      object.unitCode = data.EIID;
      object.unitName = data.EINAME;
      object.batchNumber = data.BATCH;
      object.quantity = data.BU_KOL;
      break;

    // FNU-49
    case InventoryCode.I01011:
      object.name = data.NAME;
      object.nomenclatureNumber = data.NOMNUMBER;
      object.inventoryNumber = data.INVNUMBER;
      object.serialNumber = data.FACTORYNUMBER;
      object.quantity = data.BU_KOL;
      break;

    // FNU-50
    case InventoryCode.I02G01:
    case InventoryCode.I02G02:
      object.name = data.NAME;
      object.nomenclatureNumber = data.NOMNUMBER;
      object.inventoryNumber = data.INVNUMBER;
      object.serialNumber = data.FACTORYNUMBER;
      object.unitCode = data.EIID;
      object.unitName = data.EINAME;
      object.quantity = data.BU_KOL;
      break;

    // FNU-55
    case InventoryCode.I02011:
    case InventoryCode.I02G11:
    case InventoryCode.I02G22:
      object.name = data.NAME;
      object.nomenclatureNumber = data.CODE;
      object.unitCode = data.EIID;
      object.unitName = data.EINAME;
      object.batchNumber = data.BATCH;
      object.quantity = data.BU_KOL;
      break;

    default:
      throw new Error(`Inventory code ${code} is undefined`);
  }

  return object;
};
