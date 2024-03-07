import { NextResponse } from 'next/server';
import prisma from '@/server/services/prisma';
import {
  genClog,
  makeResponseCORSLess,
  validateTabelNumber,
} from '@/lib/api/helpers';
import {
  b,
  cn,
  generateConsoleLogPrefix,
} from '@/lib/api/ansi-helpers';
import { UserStatus } from '@prisma/client';

export async function POST(request: Request) {
  const CONSOLE_LOG_PREFIX = generateConsoleLogPrefix(request.method, '/api/accounts/check');

  const clog = genClog(CONSOLE_LOG_PREFIX);

  const reqBody = await request.json();

  const tabelNumbers: string[] = reqBody.tabelNumbers;

  const firstInvalidTabNum = tabelNumbers.find(el => !validateTabelNumber(el));

  if (firstInvalidTabNum !== undefined) {
    const resp = NextResponse.json({
      "type": "urn:problem-type:unprocessable-content",
      "title": "Необрабатываемый контент",
      "detail": `Неверный формат табельного номера: ${firstInvalidTabNum}`,
      "status": 422,
    }, {
      status: 422
    });

    clog(`\n\tAt least one tabelNumber (${cn(firstInvalidTabNum).i()}) has ${b('wrong').rd()} format\n\t\t${b('Responding with status ')}${b(String(resp.status)).yl()}, '${resp.statusText}'\n`);
    return makeResponseCORSLess(resp);
  }

  const usersFound = (await prisma.user.findMany({
    where: {
      tabelNumber: { in: tabelNumbers },
    },
    select: {
      tabelNumber: true,
      status: true,
    },
  })).map(el => ({
    tabelNumber: el.tabelNumber,
    expiresAt: '2024-12-01T00:00:00Z',
    isBlocked: el.status === UserStatus.BLOCKED,
  }));

  const resp = NextResponse.json({
    "items": [
      ...usersFound
    ],
    "total": usersFound.length,
  }, {
    status: 200,
  });

  clog(`\n\tList of existing users: %O\n\t\t${b('Responding with status ')}${b(String(resp.status)).yl()}, '${resp.statusText}'\n`, usersFound);
  return makeResponseCORSLess(resp);
}
