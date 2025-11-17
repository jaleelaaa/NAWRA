"use client";

import { useTranslations } from 'next-intl';
import { BookOpen, Shield } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  const t = useTranslations('login');

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#CE1126] via-[#A00E1E] to-[#8B0A18] relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#009639]/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
          {/* Book Icon */}
          <div className="mb-8 p-6 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm">
            <BookOpen className="w-16 h-16" />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold mb-4 text-center">
            {t('branding.title')}
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-white/90 mb-12 text-center">
            {t('branding.subtitle')}
          </p>

          {/* Security Notice */}
          <div className="max-w-md w-full p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-[#009639] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">{t('branding.secureTitle')}</h3>
                <p className="text-sm text-white/90 leading-relaxed">
                  {t('branding.secureDescription')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 bg-gray-50 relative">
        {/* Language Switcher - Top Right */}
        <div className="absolute top-6 right-6 z-50">
          <LanguageSwitcher />
        </div>

        {/* Login Card */}
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="p-4 bg-[#CE1126] rounded-xl">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {t('title')}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {t('subtitle')}
              </p>
            </div>

            {/* Login Form Component */}
            <LoginForm />
          </div>

          {/* Help Text */}
          <p className="mt-6 text-center text-sm text-gray-500">
            {t('needHelp')}
          </p>
        </div>
      </div>
    </div>
  );
}
