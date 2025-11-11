"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { useAuthStore } from '@/stores/authStore';
import * as authApi from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/client';

export default function LoginForm() {
  const t = useTranslations('login');
  const locale = useLocale();
  const router = useRouter();
  const { setUser, setTokens } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form validation schema
  const loginSchema = z.object({
    email: z
      .string()
      .min(1, { message: t('errors.emailRequired') })
      .email({ message: t('errors.invalidEmail') }),
    password: z
      .string()
      .min(1, { message: t('errors.passwordRequired') }),
    rememberMe: z.boolean().default(false),
  });

  type LoginFormData = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const rememberMe = watch('rememberMe');

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      // Call login API
      const response = await authApi.login({
        email: data.email,
        password: data.password,
        remember_me: data.rememberMe,
      });

      // Store user and tokens
      setUser(response.user);
      setTokens(response.tokens.access_token, response.tokens.refresh_token);

      // Redirect to dashboard (locale is automatically preserved by i18n router)
      router.push('/dashboard');
    } catch (error: any) {
      // Handle different error types
      if (error.response?.status === 401) {
        // Authentication error - invalid credentials
        setErrorMessage(t('errors.invalidCredentials'));
      } else if (error.response?.status === 422) {
        // Validation error - extract and display backend validation message
        const errorMsg = handleApiError(error);
        setErrorMessage(errorMsg);
      } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error' || !error.response) {
        // Network error - no response from server
        setErrorMessage(t('errors.networkError'));
      } else {
        // Other errors - use centralized error handler
        const errorMsg = handleApiError(error);
        setErrorMessage(errorMsg || t('errors.unknownError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200" data-testid="login-error">
          <p className="text-sm text-red-600" data-testid="login-error-message">{errorMessage}</p>
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          {t('emailLabel')}
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder={t('emailPlaceholder')}
            className="pl-10"
            {...register('email')}
            disabled={isLoading}
            required
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          {t('passwordLabel')}
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={t('passwordPlaceholder')}
            className="pl-10 pr-10"
            {...register('password')}
            disabled={isLoading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Checkbox
            id="rememberMe"
            checked={rememberMe}
            onCheckedChange={(checked) => setValue('rememberMe', checked as boolean)}
            disabled={isLoading}
          />
          <Label
            htmlFor="rememberMe"
            className="text-sm font-normal cursor-pointer"
          >
            {t('rememberMe')}
          </Label>
        </div>
        <a
          href="#"
          className="text-sm text-cyan-700 hover:text-cyan-800 font-medium"
        >
          {t('forgotPassword')}
        </a>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-cyan-700 hover:bg-cyan-800"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 animate-spin" />
            {t('common.loading', { defaultValue: 'Loading...' })}
          </>
        ) : (
          t('signInButton')
        )}
      </Button>

      {/* Request Access */}
      <div className="text-center text-sm">
        <span className="text-gray-600">{t('noAccount')} </span>
        <a href="#" className="text-cyan-700 hover:text-cyan-800 font-medium">
          {t('requestAccess')}
        </a>
      </div>
    </form>
  );
}
