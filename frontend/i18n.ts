import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { defineRouting } from 'next-intl/routing';

// Supported locales
export const locales = ['ar', 'en'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'ar',
  localePrefix: 'always'
});

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  // If invalid, default to 'ar' to prevent crashes
  const validLocale = locales.includes(locale as Locale) ? locale : 'ar';

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  };
});
