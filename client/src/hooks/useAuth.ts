import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';

export const useAuth = (requireAuth = false, allowedRoles?: string[]) => {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, requireAuth, allowedRoles, router]);

  return { user, isAuthenticated };
};

export const useRequireAuth = (allowedRoles?: string[]) => {
  return useAuth(true, allowedRoles);
};
