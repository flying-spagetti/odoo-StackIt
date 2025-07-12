"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useRequireAuth } from "@/hooks/useAuth";
import UserStats from "@/components/dashboard/UserStats";
import QuestionStatusList from "@/components/dashboard/QuestionStatusList";
import NotificationsPanel from "@/components/dashboard/NotificationsPanel";
import { fadeIn } from "@/utils/animations";

export default function DashboardPage() {
  const { user } = useRequireAuth(["user", "admin"]);
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
          {/* <p className="text-muted-foreground">Loading your dashboard...</p> */}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="-ml-1 md:hidden" />
          <Separator orientation="vertical" className="mr-2 h-4 md:hidden" />
          <div ref={headerRef} className="flex-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Here's your activity overview and recent updates.
            </p>
          </div>
        </div>

        <div ref={contentRef} className="space-y-6 lg:space-y-8">
          {/* Stats Section */}
          <div className="bg-white rounded-2xl border shadow-sm p-6 lg:p-8">
            <UserStats userId={user.userId} />
          </div>

          {/* Recent Activity Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <QuestionStatusList userId={user.userId} limit={5} />
            </div>
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <NotificationsPanel userId={user.userId} limit={5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
