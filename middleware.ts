import { Logger } from './lib/logger';
import { isAuthorized } from './lib/auth';
import { NextResponse, NextRequest } from 'next/server';

const logger = new Logger({ name: 'HTTP' });

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// Move to config or env
const allowedOrigins = ['http://127.0.0.1:3001', 'http://localhost:3001'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPreflight = request.method === 'OPTIONS';

  const origin = request.headers.get('origin') ?? '';
  const isAllowedOrigin = allowedOrigins.includes(origin);

  const isApiEndpoint = pathname.startsWith('/api');
  const isAuthEndpoint = pathname.startsWith('/api/auth');

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

    if (!isAuthEndpoint && !isAuthorized(request)) {
      /**
       * Can't use error constructor because:
       *  Dynamic code evaluation is not available in Middleware (underscore.js using in ProblemJson module)
       *
       * @see https://nextjs.org/docs/messages/edge-dynamic-code-evaluation
       **/
      return NextResponse.json({
        type: 'urn:problem-type:unauthorized-error',
        title: 'Для доступа к запрашиваемому ресурсу требуется аутентификация',
        status: 401,
        ...(requestId && { requestId })
      }, {status: 401});
    }

    return response;
  }
}

export const config = {
  matcher: ['/api/:path*']
};
