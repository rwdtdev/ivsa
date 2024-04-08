import { isAuthorized } from './lib/auth';
import { Logger } from './lib/logger';
import { NextResponse, NextRequest } from 'next/server';

const logger = new Logger({ name: 'HTTP' });

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    const requestId = request.headers.get('RequestId');

    logger.info(`${requestId ? `[${requestId}] ` : ''}${request.method} ${request.url}`);

    if (!isAuthorized(request)) {
      return NextResponse.json(
        {
          type: 'urn:problem-type:unauthorized-error',
          title: 'Произошла ошибка',
          detail: 'Для доступа к запрашиваемому ресурсу требуется авторизация',
          status: 401
        },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/api/:path*']
};
