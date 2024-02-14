import { it, describe, expect } from 'vitest';
import {
  storeRecord,
  getRecords,
  payloadValidationErrors,
  storeRecordErrors
} from "../lib/journaling";

describe('Testing internal operations journaling', () => {
  const VALID_PAYLOADS_TO_STORE = [
    {
      id: 'tests-valid-payload_001',
      some_data_1: 'string data_001_1',
      some_data_002: [ 1, 2, 3, 4 ]
    },
    {
      id: 'tests-valid-payload_002',
      some_data_1: 'string data_002_1',
      some_data_002: [ 5, 6, 7, 8 ]
    },
    {
      id: 'tests-valid-payload_003',
      some_data_1: 'string data_003_1',
      some_data_002: [ 9, 10, 11, 12 ]
    }
  ];
  const addRandomSuffix = (inputString: string): string => `${inputString}-${(Math.random()*1000000).toFixed(0)}`;
  const SUBSYSTEM_IDS = [
    addRandomSuffix('tests-sub-sys-000'),
    addRandomSuffix('tests-sub-sys-001'),
    addRandomSuffix('tests-sub-sys-002'),
    addRandomSuffix('tests-sub-sys-003'),
    addRandomSuffix('tests-sub-sys-004'),
  ];
  const USER_IDS = [
    addRandomSuffix('tests-uid-000'),
    addRandomSuffix('tests-uid-001'),
    addRandomSuffix('tests-uid-002'),
    addRandomSuffix('tests-uid-003'),
  ];

  describe('store a journal entry', () => {

    describe('input validity checks', () => {
      it('valid input', async () => {
        const retVal = await storeRecord(USER_IDS[0], SUBSYSTEM_IDS[0], VALID_PAYLOADS_TO_STORE[0]);
        expect(retVal.success).toBeTruthy();
      });

      it('missing subsystem id', async () => {
        const retVal = await storeRecord(USER_IDS[0], '', VALID_PAYLOADS_TO_STORE[0]);
        expect(retVal.success).toBeFalsy();
        expect(retVal.errorMessage).toEqual(storeRecordErrors.NO_SUBSYSTEMID);
      });

      it('missing user id', async () => {
        const retVal = await storeRecord('', SUBSYSTEM_IDS[0], VALID_PAYLOADS_TO_STORE[0]);
        expect(retVal.success).toBeFalsy();
        expect(retVal.errorMessage).toEqual(storeRecordErrors.NO_USERID);
      });

      it('missing payload', async () => {
        const retVal = await storeRecord(USER_IDS[0], SUBSYSTEM_IDS[0], {});
        expect(retVal.success).toBeFalsy();
        expect(retVal.errorMessage).toEqual(payloadValidationErrors.EMPTY_OBJECT);
      });

      it('malformed payload', async () => {
        const MALFORMED_PAYLOAD = {
          a: 'aaa',
          b: 'bbb',
          c: (a: number) => a * a
        };
        const retVal = await storeRecord(USER_IDS[0], SUBSYSTEM_IDS[0], MALFORMED_PAYLOAD);
        expect(retVal.success).toBeFalsy();
        expect(retVal.errorMessage).toEqual(payloadValidationErrors.NON_SERIALIZABLE_OBJECT);
      });
    });

    it('store an entry', async () => {
      // store an entry
      // retrieve the entry stored
      // check if stored payloads and metadata match the retrieved
      const retVal = await storeRecord(USER_IDS[0], SUBSYSTEM_IDS[0], VALID_PAYLOADS_TO_STORE[0]);
      expect(retVal.success).toBeTruthy();

      const retrievedEntry = await getRecords({
        userIds: [ USER_IDS[0] ],
        subsystemIds: [ SUBSYSTEM_IDS[0] ]
      });
      expect(retrievedEntry.success).toBeTruthy();
      expect(JSON.parse(retrievedEntry.records[0].payload as string)).toMatchObject(VALID_PAYLOADS_TO_STORE[0]);
    });
  });

  describe('retrieve stored entries from journal', () => {
    it('retrieve a single entry by limiting maxRecordsToReturn', async () => {
      await storeRecord(USER_IDS[1], SUBSYSTEM_IDS[1], VALID_PAYLOADS_TO_STORE[0]);
      await storeRecord(USER_IDS[1], SUBSYSTEM_IDS[1], VALID_PAYLOADS_TO_STORE[1]);
      await storeRecord(USER_IDS[1], SUBSYSTEM_IDS[2], VALID_PAYLOADS_TO_STORE[0]);
      const retrievedEntry = await getRecords({
        userIds: [ USER_IDS[1] ],
        subsystemIds: [ SUBSYSTEM_IDS[1] ],
        maxRecordsToReturn: 1
      });
      expect(retrievedEntry.success).toBeTruthy();
      expect(retrievedEntry.records).toHaveLength(1);
    });

    it('retrieve a non-existant entry', async () => {
      const retrievedEntry = await getRecords({
        userIds: [ USER_IDS[1] ],
        subsystemIds: [ SUBSYSTEM_IDS[3] ]
      });
      expect(retrievedEntry.success).toBeTruthy();
      expect(retrievedEntry.records).toHaveLength(0);
    });

    it('retrieve multiple entries [any subsystem, any timestamp, a list of users]', async () => {
      await storeRecord(USER_IDS[1], SUBSYSTEM_IDS[1], VALID_PAYLOADS_TO_STORE[2]);
      await storeRecord(USER_IDS[2], SUBSYSTEM_IDS[1], VALID_PAYLOADS_TO_STORE[0]);
      await storeRecord(USER_IDS[2], SUBSYSTEM_IDS[2], VALID_PAYLOADS_TO_STORE[1]);
      await storeRecord(USER_IDS[3], SUBSYSTEM_IDS[1], VALID_PAYLOADS_TO_STORE[2]);
      const retrievedEntry = await getRecords({
        userIds: [ USER_IDS[2], USER_IDS[3] ]
      });
      expect(retrievedEntry.success).toBeTruthy();
      expect(retrievedEntry.records).toHaveLength(3);
    });

    it('retrieve multiple entries [any subsystem, any timestamp, a list of users]', async () => {
      await storeRecord(USER_IDS[2], SUBSYSTEM_IDS[1], VALID_PAYLOADS_TO_STORE[1]);
      await storeRecord(USER_IDS[2], SUBSYSTEM_IDS[2], VALID_PAYLOADS_TO_STORE[1]);
      await storeRecord(USER_IDS[2], SUBSYSTEM_IDS[3], VALID_PAYLOADS_TO_STORE[1]);
      await storeRecord(USER_IDS[3], SUBSYSTEM_IDS[3], VALID_PAYLOADS_TO_STORE[2]);
      await storeRecord(USER_IDS[1], SUBSYSTEM_IDS[4], VALID_PAYLOADS_TO_STORE[2]);
      await storeRecord(USER_IDS[2], SUBSYSTEM_IDS[4], VALID_PAYLOADS_TO_STORE[2]);
      const retrievedEntry = await getRecords({
        subsystemIds: [ SUBSYSTEM_IDS[3], SUBSYSTEM_IDS[4] ]
      });
      expect(retrievedEntry.success).toBeTruthy();
      expect(retrievedEntry.records).toHaveLength(4);
    });
  });

});
