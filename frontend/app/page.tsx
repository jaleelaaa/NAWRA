import { redirect } from 'next/navigation';
import { routing } from '@/i18n';

/**
 * Root Page - Redirects to Login Page
 *
 * This page handles requests to the root URL (/) and redirects
 * to the login page in the default locale.
 *
 * Flow: / → /ar/login → (after login) → /ar/dashboard
 */
export default function RootPage() {
  // Redirect to login page in default locale (Arabic)
  redirect(`/${routing.defaultLocale}/login`);
}
