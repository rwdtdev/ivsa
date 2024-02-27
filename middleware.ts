import { NextRequest, NextResponse } from 'next/server';

// export { default } from 'next-auth/middleware';

import pino from 'pino';

const logger = pino({
  name: 'HTTP'
});

export function middleware(req: NextRequest) {
  logger.info(`${req.method} [${req.url}]`);
}

// export const config = { matcher: ['/admin/:path*', '/protected/:path*'] };
