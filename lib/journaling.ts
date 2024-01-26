const DEFAULT_MAX_RECORDS_TO_RETURN = 1000;

export enum payloadValidationErrors {
  EMPTY_OBJECT = 'Payload is an empty object',
  NON_SERIALIZABLE_OBJECT = 'Payload object is not serializable',
}

export enum storeRecordErrors {
  NO_USERID = 'Missing user id',
  NO_SUBSYSTEMID = 'Missing subsystem id',
}

export interface storeRecordReturnValue {
  success: boolean;
  errorMessage?: storeRecordErrors | payloadValidationErrors;
}

export interface getRecordsParameters {
  userIds?: string[];
  subSystemIds?: string[];
  timestampRange?: any; // TODO Proper range value
  maxRecordsToReturn?: number;
}

export interface storedRecord {
  userId: string;
  subSystemId: string;
  timestamp: number;
  payload: object;  
}

export interface getRecordsReturnValue {
  success: boolean;
  errorMessage?: string;
  records: storedRecord[];
}

interface payloadValidationReturnValue {
  valid: boolean;
  invalidationReason?: payloadValidationErrors;
}

function validatePayload(payload: Object): payloadValidationReturnValue {
  const isEmpty = (obj: Object): payloadValidationErrors | undefined => Object.keys(obj).length === 0 ? payloadValidationErrors.EMPTY_OBJECT : undefined; 

  const isSerializable = (obj: Object): payloadValidationErrors | undefined => {
    const areEqual = (x: any, y: any): boolean => !(typeof x === 'object' && typeof x === typeof y) ? x === y  : (Object.keys(x).length === Object.keys(y).length && Object.keys(x).every(key => areEqual(x[key], y[key])));
    const parsedObject = JSON.parse(JSON.stringify(obj));
    return areEqual(obj, parsedObject) ? undefined : payloadValidationErrors.NON_SERIALIZABLE_OBJECT;
  }

  const error = isEmpty(payload) ?? isSerializable(payload);

  return {
    valid: !error,
    invalidationReason: error
  };
}

export function storeRecord(
  userId: string,
  subSystemId: string,
  payload: object
): storeRecordReturnValue {
  if (userId.length === 0) {
    return {
      success: false,
      errorMessage: storeRecordErrors.NO_USERID
    };
  }

  if (subSystemId.length === 0) {
    return {
      success: false,
      errorMessage: storeRecordErrors.NO_SUBSYSTEMID
    };
  }

  const payloadValidation = validatePayload(payload);
  if (!payloadValidation.valid) {
    return {
      success: false,
      errorMessage: payloadValidation.invalidationReason
    };
  }

  return { success: true };
}

export function getRecords(params: getRecordsParameters): getRecordsReturnValue {
  const maxRecords = params.maxRecordsToReturn ?? DEFAULT_MAX_RECORDS_TO_RETURN;
  
  return {
    success: true,
    records: [ {
      userId: 'uid001',
      subSystemId: 'subsysid001',
      timestamp: Date.now(),
      payload: {}
    } ]
  };
}
