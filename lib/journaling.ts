import { JsonValue } from '@prisma/client/runtime/library';
import prisma from '../core/prisma';

const DEFAULT_MAX_RECORDS_TO_RETURN = 1000;

/* eslint-disable */
export enum payloadValidationErrors {
  EMPTY_OBJECT = 'Payload is an empty object',
  NON_SERIALIZABLE_OBJECT = 'Payload object is not serializable'
}
export enum storeRecordErrors {
  NO_USERID = 'Missing user id',
  NO_SUBSYSTEMID = 'Missing subsystem id',
  PRISMA = 'Prisma or lower level error'
}
/* eslint-enable */

export interface storeRecordReturnValue {
  success: boolean;
  errorMessage?: storeRecordErrors | payloadValidationErrors;
}

export interface getRecordsParameters {
  userIds?: string[];
  subsystemIds?: string[];
  timestampFrom?: number;
  timestampTo?: number;
  maxRecordsToReturn?: number;
}

export interface storedRecord {
  userId: string;
  subsystemId: string;
  createdAt: Date;
  payload: JsonValue;
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

function validatePayload(payload: Record<string, any>): payloadValidationReturnValue {
  const isEmpty = (obj: Record<string, any>): payloadValidationErrors | undefined =>
    Object.keys(obj).length === 0 ? payloadValidationErrors.EMPTY_OBJECT : undefined;

  const isSerializable = (
    obj: Record<string, unknown>
  ): payloadValidationErrors | undefined => {
    const areEqual = (x: any, y: any): boolean =>
      !(typeof x === 'object' && typeof x === typeof y)
        ? x === y
        : Object.keys(x).length === Object.keys(y).length &&
          Object.keys(x).every((key) => areEqual(x[key], y[key]));
    const parsedObject = JSON.parse(JSON.stringify(obj));
    return areEqual(obj, parsedObject)
      ? undefined
      : payloadValidationErrors.NON_SERIALIZABLE_OBJECT;
  };

  const error = isEmpty(payload) ?? isSerializable(payload);

  return {
    valid: !error,
    invalidationReason: error
  };
}

export async function storeRecord(
  userId: string,
  subsystemId: string,
  payload: object
): Promise<storeRecordReturnValue> {
  if (userId.length === 0) {
    return {
      success: false,
      errorMessage: storeRecordErrors.NO_USERID
    };
  }

  if (subsystemId.length === 0) {
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

  try {
    await prisma.operationRecord.create({
      data: { userId, subsystemId, payload: JSON.stringify(payload) }
    });
    return {
      success: true
    };
  } catch (error) {
    return {
      success: false,
      errorMessage: storeRecordErrors.PRISMA
    };
  }
}

export async function getRecords(
  params: getRecordsParameters
): Promise<getRecordsReturnValue> {
  const maxRecords = params.maxRecordsToReturn ?? DEFAULT_MAX_RECORDS_TO_RETURN;
  const tstampFrom = params.timestampFrom ?? 0;
  const tstampTo = params.timestampTo ?? Date.now();
  const queryParams = [];

  if (params.userIds) {
    queryParams.push({ userId: { in: params.userIds } });
  }

  if (params.subsystemIds) {
    queryParams.push({ subsystemId: { in: params.subsystemIds } });
  }

  const records = await prisma.operationRecord.findMany({
    take: maxRecords,
    where: {
      AND: [
        ...queryParams,
        {
          createdAt: {
            gte: new Date(tstampFrom).toISOString(),
            lte: new Date(tstampTo).toISOString()
          }
        }
      ]
    },
    select: {
      id: true,
      userId: true,
      subsystemId: true,
      createdAt: true,
      payload: true
    },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }]
  });

  return {
    success: true,
    records
  };
}
