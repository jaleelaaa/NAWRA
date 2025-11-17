'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useAuthStore } from '@/stores/authStore';
import { hasAnyPermission } from '@/lib/permissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requireAll?: boolean;
  fallbackPath?: string;
}

export default function ProtectedRoute({
  children,
  requiredPermissions = [],
  requireAll = false,
  fallbackPath = '/dashboard',
}: ProtectedRouteProps) {
  const router = useRouter();
  const locale = useLocale();
  const { user, isAuthenticated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Check authentication and permissions
    const checkAccess = () => {
      // Not authenticated - redirect to login
      if (!isAuthenticated || !user) {
        router.push(`/${locale}/login`);
        return;
      }

      // No permissions required - allow access
      if (requiredPermissions.length === 0) {
        setHasAccess(true);
        setIsChecking(false);
        return;
      }

      // Check permissions
      const userPermissions = user.permissions || [];

      let access = false;
      if (requireAll) {
        // User must have ALL required permissions
        access = requiredPermissions.every((perm) => userPermissions.includes(perm));
      } else {
        // User must have at least ONE permission
        access = hasAnyPermission(userPermissions, requiredPermissions);
      }

      if (!access) {
        // No permission - redirect to fallback
        router.push(`/${locale}${fallbackPath}`);
        setHasAccess(false);
      } else {
        setHasAccess(true);
      }

      setIsChecking(false);
    };

    checkAccess();
  }, [user, isAuthenticated, router, locale, requiredPermissions, requireAll, fallbackPath]);

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B2635] mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Don't render if no access
  if (!isAuthenticated || !user) {
    return null;
  }

  // Show access denied if permissions don't match
  if (requiredPermissions.length > 0 && !hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md px-6">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">
            You don't have permission to access this page.
            <br />
            Please contact your administrator if you believe this is an error.
          </p>
          <button
            onClick={() => router.push(`/${locale}/dashboard`)}
            className="bg-[#8B2635] text-white px-6 py-3 rounded-lg hover:bg-[#6B1F2E] transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Render children if all checks pass
  return <>{children}</>;
}
