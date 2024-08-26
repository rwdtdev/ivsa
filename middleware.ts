import { Logger } from './lib/logger';
import { isAuthorized } from './lib/auth';
import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { UserRole, UserStatus } from '@prisma/client';

const logger = new Logger({ name: 'HTTP' });

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// Move to config or env
const allowedOrigins = ['http://127.0.0.1:3001', 'http://localhost:3001'];

export async function middleware(request: NextRequest) {
  const jwt = await getToken({ req: request });
  const { pathname } = request.nextUrl;
  const isPreflight = request.method === 'OPTIONS';

  const origin = request.headers.get('origin') ?? '';
  const isAllowedOrigin = allowedOrigins.includes(origin);

  const isApiEndpoint = pathname.startsWith('/api');
  const isAuthEndpoint = pathname.startsWith('/api/auth');
  const isLoginPath = pathname.startsWith('/login');
  const isAdminPath = pathname.startsWith('/admin');

  const isAndroidAppStartPath = pathname.startsWith('/start');
  const isAndroidAppStopPath = pathname.startsWith('/stop');

  if (isAndroidAppStartPath || isAndroidAppStopPath) {
    return new NextResponse(null, { status: 204 });
  }

  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...corsOptions
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  if (isApiEndpoint) {
    const requestId = request.headers.get('RequestId');

    if (!isAuthEndpoint && !jwt?.user && !isAuthorized(request)) {
      /**
       * Can't use error constructor because:
       *  Dynamic code evaluation is not available in Middleware (underscore.js using in ProblemJson module)
       *
       * @see https://nextjs.org/docs/messages/edge-dynamic-code-evaluation
       **/
      return NextResponse.json(
        {
          type: 'urn:problem-type:unauthorized-error',
          title: 'Для доступа к запрашиваемому ресурсу требуется аутентификация',
          status: 401,
          ...(requestId && { requestId })
        },
        { status: 401 }
      );
    } else if (!isAuthEndpoint && jwt?.user) {
      if (jwt.user.status === UserStatus.BLOCKED) {
        return NextResponse.json(
          {
            type: 'urn:problem-type:unauthorized-error',
            title: 'Доступ запрещен',
            status: 403,
            ...(requestId && { requestId })
          },
          { status: 403 }
        );
      }
    }
    return response;
  }

  if (!jwt?.user && !isLoginPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (pathname === '/events') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isAdminPath && jwt?.user.role !== UserRole.ADMIN) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/',
    '/api/:path*',
    '/admin/:path*',
    '/login/:path*',
    '/events/:path*',
    '/start',
    '/stop'
  ]
};
