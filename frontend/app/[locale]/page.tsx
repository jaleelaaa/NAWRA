import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  // Await params to get the locale
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  // Redirect to login page (users must authenticate before accessing dashboard)
  redirect(`/${locale}/login`);
}
