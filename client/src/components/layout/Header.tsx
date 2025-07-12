'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import useAuthStore from '@/store/authStore';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          DevForum
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            Questions
          </Link>
          <Link href="/tags" className="text-muted-foreground hover:text-foreground">
            Tags
          </Link>
        </nav>

        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.name}
              </span>
              {user?.role === 'admin' && (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin">Admin</Link>
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
