const DEFAULT_MAX_RECORDS_TO_RETURN = 1000;

export interface storeRecordReturnValue {
  success: boolean;
  errorMessage?: string;
}

export interface getRecordsParameters {
  userIds?: string[];
  subSystemIds?: string[];
  timestampRange?: any; // TODO Proper tange value
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
  invalidationReason?: string;
}

function validatePayload(payload: object): payloadValidationReturnValue {
  // TODO add parameter validation (payload must be serializable object), return error if invalid
  return { valid: true };
}

export function storeRecord(
  userId: string,
  subSystemId: string,
  payload: object
): storeRecordReturnValue {
  const payloadValidation = validatePayload(payload);
  if (!payloadValidation.valid) {
    return {
      success: false,
      errorMessage: `Payload is invalid: ${payloadValidation.invalidationReason}`
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
