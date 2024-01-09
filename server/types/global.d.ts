import { PrismaClient } from '@prisma/client';

// just for global.prisma in src/server/prisma.ts
declare global {
  /* eslint-disable no-var */
  var prisma: PrismaClient;
}
