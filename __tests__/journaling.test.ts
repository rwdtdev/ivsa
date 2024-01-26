import {
  storeRecord,
  getRecords,
  payloadValidationErrors,
  storeRecordErrors
} from "../lib/journaling";

describe('Testing internal operations journaling', () => {
  const VALID_PAYLOADS_TO_STORE = [
    {
      id: 'payload_001',
      some_data_1: 'string data_001_1',
      some_data_002: [ 1, 2, 3, 4 ]
    },
    {
      id: 'payload_002',
      some_data_1: 'string data_002_1',
      some_data_002: [ 5, 6, 7, 8 ]
    },
    {
      id: 'payload_003',
      some_data_1: 'string data_003_1',
      some_data_002: [ 9, 10, 11, 12 ]
    }
  ];
  const SUBSYSTEM_IDS = [ 'sub-sys-001', 'sub-sys-002', 'sub-sys-003' ];
  const USER_IDS = [ 'uid-001', 'uid-002', 'uid-003' ];

  describe('store a journal entry', () => {

    describe('input validity checks', () => {
      it('valid input', () => {
        const retVal = storeRecord(USER_IDS[0], SUBSYSTEM_IDS[0], VALID_PAYLOADS_TO_STORE[0]);
        expect(retVal.success).toBeTruthy();
      });

      it('missing subsystem id', () => {
        const retVal = storeRecord(USER_IDS[0], '', VALID_PAYLOADS_TO_STORE[0]);
        expect(retVal.success).toBeFalsy();
        expect(retVal.errorMessage).toEqual(storeRecordErrors.NO_SUBSYSTEMID);
      });

      it('missing user id', () => {
        const retVal = storeRecord('', SUBSYSTEM_IDS[0], VALID_PAYLOADS_TO_STORE[0]);
        expect(retVal.success).toBeFalsy();
        expect(retVal.errorMessage).toEqual(storeRecordErrors.NO_USERID);
      });

      it('missing payload', () => {
        const retVal = storeRecord(USER_IDS[0], SUBSYSTEM_IDS[0], {});
        expect(retVal.success).toBeFalsy();
        expect(retVal.errorMessage).toEqual(payloadValidationErrors.EMPTY_OBJECT);
      });

      it('malformed payload', () => {
        const MALFORMED_PAYLOAD = {
          a: 'aaa',
          b: 'bbb',
          c: (a: number) => a * a
        };
        const retVal = storeRecord(USER_IDS[0], SUBSYSTEM_IDS[0], MALFORMED_PAYLOAD);
        expect(retVal.success).toBeFalsy();
        expect(retVal.errorMessage).toEqual(payloadValidationErrors.NON_SERIALIZABLE_OBJECT);
      });
    });

    it.skip('store an entry', () => {
      // store an entry
      // retrieve the entry stored
      // check if stored payloads and metadata match the retrieved
      const retVal = storeRecord(USER_IDS[0], SUBSYSTEM_IDS[0], VALID_PAYLOADS_TO_STORE[0]);
      expect(retVal.success).toBeTruthy();

      const retrievedEntry = getRecords({
        userIds: [ USER_IDS[0] ],
        subSystemIds: [ SUBSYSTEM_IDS[0] ]
      });
      expect(retrievedEntry.success).toBeTruthy();
      expect(retrievedEntry.records[0].payload).toMatchObject(VALID_PAYLOADS_TO_STORE[0]);
    });

  });

  describe('retrieve stored entries from journal', () => {
    beforeEach(() => {
      storeRecord(USER_IDS[0], SUBSYSTEM_IDS[0], VALID_PAYLOADS_TO_STORE[0]);
      storeRecord(USER_IDS[0], SUBSYSTEM_IDS[0], VALID_PAYLOADS_TO_STORE[1]);
      storeRecord(USER_IDS[0], SUBSYSTEM_IDS[1], VALID_PAYLOADS_TO_STORE[0]);
      storeRecord(USER_IDS[0], SUBSYSTEM_IDS[2], VALID_PAYLOADS_TO_STORE[2]);
      storeRecord(USER_IDS[1], SUBSYSTEM_IDS[0], VALID_PAYLOADS_TO_STORE[0]);
      storeRecord(USER_IDS[1], SUBSYSTEM_IDS[1], VALID_PAYLOADS_TO_STORE[1]);
      storeRecord(USER_IDS[2], SUBSYSTEM_IDS[0], VALID_PAYLOADS_TO_STORE[2]);
    })

    it.skip('retrieve a single entry by limiting maxRecordsToReturn', () => {
      const retrievedEntry = getRecords({
        userIds: [ USER_IDS[0] ],
        subSystemIds: [ SUBSYSTEM_IDS[0] ],
        maxRecordsToReturn: 1
      });
      expect(retrievedEntry.success).toBeTruthy();
      expect(retrievedEntry.records).toHaveLength(1);
    });

    it.skip('retrieve a non-existant entry', () => {
      const retrievedEntry = getRecords({
        userIds: [ USER_IDS[2] ],
        subSystemIds: [ SUBSYSTEM_IDS[1] ]
      });
      expect(retrievedEntry.success).toBeFalsy();
      expect(retrievedEntry.records).toHaveLength(0);
    });

    it.skip('retrieve multiple entries [any subsystem, any timestamp, a list of users]', () => {
      const retrievedEntry = getRecords({
        userIds: [ USER_IDS[0], USER_IDS[1] ]
      });
      expect(retrievedEntry.success).toBeTruthy();
      expect(retrievedEntry.records).toHaveLength(6);
    });

    it.skip('retrieve multiple entries [any subsystem, any timestamp, a list of users]', () => {
      const retrievedEntry = getRecords({
        subSystemIds: [ SUBSYSTEM_IDS[1], SUBSYSTEM_IDS[2] ]
      });
      expect(retrievedEntry.success).toBeTruthy();
      expect(retrievedEntry.records).toHaveLength(3);
    });
  });

});
