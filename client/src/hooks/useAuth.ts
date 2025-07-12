import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "@/store/authStore";

export const useAuth = (requireAuth = false, allowedRoles?: string[]) => {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect if we're already on auth pages
    if (pathname.startsWith("/auth/")) return;

    // Only redirect to login if auth is required AND user is not authenticated
    // if (requireAuth && !isAuthenticated) {
    //   router.push('/auth/login');
    //   return;
    // }

    // Only check roles if user is authenticated and roles are specified
    if (
      isAuthenticated &&
      allowedRoles &&
      user &&
      !allowedRoles.includes(user.role)
    ) {
      router.push("/");
      return;
    }
  }, [isAuthenticated, user, requireAuth, allowedRoles, router, pathname]);

  return { user, isAuthenticated };
};

export const useRequireAuth = (allowedRoles?: string[]) => {
  return useAuth(true, allowedRoles);
};
