import { NextResponse } from 'next/server';
import { beforeAll, describe, expect, expectTypeOf, test } from 'vitest';

describe('/api/accpounts/check', () => {
  describe('GET', () => {
    const VALID_EXISTING_TABEL_NUMBERS = [
      'cls1ue75i000w08l5g6maf0go',
      'cls1ue75i000x08l5fgljglsa',
      'cls1ue75i000y08l57jkc16yb',
      'cls1ue75i000z08l5c6ky4les',
      'cls1ue75i001008l51m9wf4ib',
    ];

    const INVALID_TABEL_NUMBERS = [
      '111111111111111111111',
      '22222222222222222222222',
      '333333333333333333333333333',
      '44444444444444444444444444444',
    ];

    const VALID_BUT_NON_EXISTANT_TABEL_NUMBERS = [
      'cls1ue75i001308l59jrk6z71',
      'cls1ue75i001408l52c69bbxv',
      'cls1ue75i001508l5b2lvfkii',
    ];

    // --->run API server here<---

    interface IUrlGenParams {
      valid_and_existing_in_db: number[];
      valid_but_absent_from_db: number[];
      invalid: number[];
    }
    function urlGen(params: IUrlGenParams): string {
      const BASE_URL = 'http://localhost:3000/api/accounts/check';
      const {
        valid_and_existing_in_db,
        valid_but_absent_from_db,
        invalid
      } = params;
      const val_exist = VALID_EXISTING_TABEL_NUMBERS.filter((el, idx) => valid_and_existing_in_db.includes(idx));
      const val_absent = VALID_BUT_NON_EXISTANT_TABEL_NUMBERS.filter((el, idx) => valid_but_absent_from_db.includes(idx));
      const inval = INVALID_TABEL_NUMBERS.filter((el, idx) => invalid.includes(idx));

      return `${BASE_URL}?${val_exist.concat(val_absent).concat(inval).map(el=>`tabelNumber=${el}`).join('&')}`; 
    }

    test('Вызов содержит невалидные форматы табельных номеров. Ответ должен быть со статусом 422 (неверный формат).', async () => {
      const response: Response = await fetch(urlGen({valid_and_existing_in_db: [ 0, 1, 2 ], valid_but_absent_from_db: [ 0, 1 ], invalid: [ 3 ]}));
      const body = await response.json();
      expect(response.status).toBe(422);
      expect(body).toMatchObject({
        type: `urn:problem-type:unprocessable-content`,
        title: `Необрабатываемый контент`,
        detail: `Неверный формат табельного номера: ${INVALID_TABEL_NUMBERS[3]}`,
        status: 422,
      });
    }, {
      timeout: 1000,
    });
  
    test('Вызов содержит валидные форматы табельных номеров: три существующие в базе и два - несуществующие. Ответ должен быть со статусом 200 и содержать список несуществующих номеров.', async () => {
      const response: Response = await fetch(urlGen({valid_and_existing_in_db: [ 0, 1, 2 ], valid_but_absent_from_db: [ 0, 1 ], invalid: []}));
      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body).toMatchObject({
        items: [
           VALID_BUT_NON_EXISTANT_TABEL_NUMBERS[0],
           VALID_BUT_NON_EXISTANT_TABEL_NUMBERS[1],
        ],
        total: 2
      });
    }, {
      timeout: 1000,
    });
  
    test('Вызов содержит валидные существущие в базе табельные номера. Ответ должен быть со статусом 200 и содержать пустой список несуществующих в базе номеров.', async () => {
      const response: Response = await fetch(urlGen({valid_and_existing_in_db: [ 0, 1, 2 ], valid_but_absent_from_db: [], invalid: []}));
      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body).toMatchObject({
        items: [],
        total: 0
      });
    }, {
      timeout: 1000,
    });
  });
});
