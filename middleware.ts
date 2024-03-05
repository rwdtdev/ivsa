import pino from 'pino';

const logger = pino({ name: 'HTTP' });

import { withAuth } from 'next-auth/middleware';
import { NextResponse, NextRequest } from 'next/server';

function yourOwnMiddleware(request: NextRequest) {
  logger.info(`${request.method} [${request.url}]`);

  // return NextResponse.redirect(new URL('/admin/users', request.url));
}

export default withAuth(yourOwnMiddleware, {
  callbacks: {
    async authorized({ token, req }) {
      return !!token;
    }
  }
});

export const config = { matcher: ['/admin/:path*', '/protected/:path*'] };
