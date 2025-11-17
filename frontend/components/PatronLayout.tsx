'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  BookOpen,
  Home,
  Search,
  FileText,
  User,
  Menu,
  X,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import LanguageSwitcher from './LanguageSwitcher';

interface PatronLayoutProps {
  children: ReactNode;
}

export default function PatronLayout({ children }: PatronLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const isRTL = locale === 'ar';

  useEffect(() => {
    // Check if user is authenticated and is a patron
    if (!user) {
      router.push(`/${locale}/login`);
      return;
    }

    if (user.user_type !== 'patron') {
      // Redirect non-patrons to admin dashboard
      router.push(`/${locale}/dashboard`);
    }
  }, [user, router, locale]);

  useEffect(() => {
    // Initialize dark mode from localStorage
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    logout();
    router.push(`/${locale}/login`);
  };

  const navigation = [
    {
      name: t('patron.nav.dashboard'),
      href: `/${locale}/patron`,
      icon: Home,
      current: pathname === `/${locale}/patron`,
    },
    {
      name: t('patron.nav.catalog'),
      href: `/${locale}/patron/catalog`,
      icon: Search,
      current: pathname === `/${locale}/patron/catalog`,
    },
    {
      name: t('patron.nav.myLoans'),
      href: `/${locale}/patron/loans`,
      icon: BookOpen,
      current: pathname === `/${locale}/patron/loans`,
    },
    {
      name: t('patron.nav.myRequests'),
      href: `/${locale}/patron/requests`,
      icon: FileText,
      current: pathname === `/${locale}/patron/requests`,
    },
    {
      name: t('patron.nav.myProfile'),
      href: `/${locale}/patron/profile`,
      icon: User,
      current: pathname === `/${locale}/patron/profile`,
    },
  ];

  if (!user || user.user_type !== 'patron') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CE1126]"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          right: isRTL ? '0' : 'auto',
          left: isRTL ? 'auto' : '0',
        }}
        className={`${
          sidebarOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'
        } fixed inset-y-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-[#CE1126]" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">NAWRA</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#009639] flex items-center justify-center text-white font-semibold">
                {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {isRTL && user.arabic_name ? user.arabic_name : (user.full_name || user.email)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {t('patron.nav.patronLabel')}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.current
                    ? 'bg-red-50 text-[#CE1126] dark:bg-red-900/20 dark:text-red-300'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Settings & Logout */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              {darkMode ? t('patron.nav.lightMode') : t('patron.nav.darkMode')}
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              {t('patron.nav.logout')}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        style={{
          marginRight: isRTL ? '256px' : '0',
          marginLeft: isRTL ? '0' : '256px',
        }}
        className="max-lg:!ml-0 max-lg:!mr-0"
      >
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1" />
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="hidden lg:flex p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
