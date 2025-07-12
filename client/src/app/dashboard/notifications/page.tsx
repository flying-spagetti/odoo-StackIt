'use client';

import { useEffect, useRef } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { useRequireAuth } from '@/hooks/useAuth';
import NotificationsPanel from '@/components/dashboard/NotificationsPanel';
import { fadeIn } from '@/utils/animations';

export default function NotificationsPage() {
  const { user } = useRequireAuth(['user', 'admin']);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      fadeIn(headerRef.current, { delay: 0.2 });
    }
    if (contentRef.current) {
      fadeIn(contentRef.current, { delay: 0.4 });
    }
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div ref={headerRef}>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated on your questions, answers, and community activity.
          </p>
        </div>
      </div>

      <div ref={contentRef}>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <NotificationsPanel userId={user.userId} />
        </div>
      </div>
    </div>
  );
}
