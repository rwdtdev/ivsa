import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (typeof window === 'undefined') {
  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient({
        log: ['query', 'info', 'warn', 'error']
      });
    }
    prisma = global.prisma;
  }
}

// @ts-expect-error export before init
export default prisma;
