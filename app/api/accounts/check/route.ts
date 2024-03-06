import { NextResponse } from 'next/server';
import {
  VALID_TABEL_NUMBERS,
  makeResponseCORSLess,
  validateTabelNumber
} from '@/lib/api/helpers';

export const VALID_BUT_NON_EXISTANT_TABEL_NUMBERS = [
  'cls1ue75i001308l59jrk6z71',
  'cls1ue75i001408l52c69bbxv',
  'cls1ue75i001508l5b2lvfkii'
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const tabelNumbers = Array.from(searchParams.entries())
    .filter((el) => el[0] === 'tabelNumber')
    .map((el) => el[1]);

  const firstInvalidTabNum = tabelNumbers.find((el) => !validateTabelNumber(el));

  if (firstInvalidTabNum) {
    const resp = NextResponse.json(
      {
        type: 'urn:problem-type:unprocessable-content',
        title: 'Необрабатываемый контент',
        detail: `Неверный формат табельного номера: ${firstInvalidTabNum}`,
        status: 422
      },
      {
        status: 422
      }
    );
    return makeResponseCORSLess(resp);
  }

  const usersFound = tabelNumbers.filter(
    (el) =>
      VALID_TABEL_NUMBERS.includes(el) &&
      !VALID_BUT_NON_EXISTANT_TABEL_NUMBERS.includes(el)
  );
  const absentUsers = tabelNumbers.filter((el) => !usersFound.includes(el));

  const resp = NextResponse.json(
    {
      items: [...absentUsers],
      total: absentUsers.length
    },
    {
      status: 200
    }
  );

  return makeResponseCORSLess(resp);
}
