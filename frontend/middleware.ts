import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n';

export default createMiddleware({
  ...routing,
  // Disable automatic locale detection to always use defaultLocale for root URL
  localeDetection: false
});

export const config = {
  // Match all pathnames except for
  // - API routes
  // - Static files
  // - Image optimization files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
