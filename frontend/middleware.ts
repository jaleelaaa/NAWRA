import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n';

const intlMiddleware = createMiddleware({
  ...routing,
  // Disable automatic locale detection to always use defaultLocale for root URL
  localeDetection: false
});

export default async function middleware(request: NextRequest) {
  // First, handle i18n
  const response = intlMiddleware(request);

  // Get pathname
  const pathname = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
  const staticPaths = ['/_next', '/api', '/favicon', '/images', '/fonts', '/static'];

  // Check if path is public or static
  const isPublicPath = publicPaths.some((path) => pathname.includes(path));
  const isStaticPath = staticPaths.some((path) => pathname.includes(path));

  // Skip auth check for public and static paths
  if (isPublicPath || isStaticPath) {
    return response;
  }

  // Check for authentication token in localStorage
  // Note: We can't access localStorage from middleware, so we check cookies
  const authToken = request.cookies.get('auth-token')?.value ||
                    request.cookies.get('access_token')?.value ||
                    request.cookies.get('refreshToken')?.value;

  // If no token and trying to access protected route, redirect to login
  if (!authToken && !pathname.includes('/login')) {
    // Extract locale from pathname or use default
    const locale = pathname.split('/')[1] || 'en';
    const validLocales = ['en', 'ar'];
    const finalLocale = validLocales.includes(locale) ? locale : 'en';

    const loginUrl = new URL(`/${finalLocale}/login`, request.url);
    // Add redirect parameter to return user after login
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user has token but tries to access login page, redirect to dashboard
  if (authToken && pathname.includes('/login')) {
    const locale = pathname.split('/')[1] || 'en';
    const validLocales = ['en', 'ar'];
    const finalLocale = validLocales.includes(locale) ? locale : 'en';

    const dashboardUrl = new URL(`/${finalLocale}/dashboard`, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return response;
}

export const config = {
  // Match all pathnames except for
  // - API routes
  // - Static files
  // - Image optimization files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
