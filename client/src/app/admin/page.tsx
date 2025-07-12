'use client';

import { useEffect, useRef } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useRequireAuth } from '@/hooks/useAuth';
import AdminStats from '@/components/admin/AdminStats';
import PendingQuestions from '@/components/admin/PendingQuestions';
import AdminActivity from '@/components/admin/AdminActivity';
import { fadeIn } from '@/utils/animations';

export default function AdminDashboard() {
  const { user } = useRequireAuth(['admin']);
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
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div ref={headerRef} className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-red-900">
              Admin Overview 🛡️
            </h1>
            <p className="text-muted-foreground">
              Monitor platform activity and manage community content.
            </p>
          </div>
          <Badge className="bg-red-500 text-white hover:bg-red-500">
            Administrator Access
          </Badge>
        </div>
      </div>

      <div ref={contentRef} className="space-y-8">
        {/* Stats Section */}
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <AdminStats />
          </div>
        </div>

        {/* Management Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <PendingQuestions limit={5} />
          </div>
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <AdminActivity limit={5} />
          </div>
        </div>
      </div>
    </div>
  );
}
