"use client";

import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const params = useParams();
  const locale = params.locale as string;
  const pathname = usePathname();
  const t = useTranslations('languages');

  const newLocale = locale === 'ar' ? 'en' : 'ar';
  const pathWithoutLocale = pathname.replace(/^\/(ar|en)/, '');
  const newPath = `/${newLocale}${pathWithoutLocale}`;

  return (
    <a
      href={newPath}
      className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs relative z-50"
    >
      <Globe className="w-4 h-4" />
      <span>{locale === 'ar' ? t('en') : t('ar')}</span>
    </a>
  );
}
