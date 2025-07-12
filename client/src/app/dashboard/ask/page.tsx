'use client';

import { useEffect, useRef } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { useRequireAuth } from '@/hooks/useAuth';
import QuestionForm from '@/components/dashboard/QuestionForm';
import { fadeIn } from '@/utils/animations';
import useAuthStore from '@/store/authStore';

export default function AskQuestionPage() {
  const { user, isAuthenticated } = useAuthStore();
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  console.log('AskQuestionPage - isAuthenticated:', isAuthenticated, 'user:', user);

  useEffect(() => {
    if (headerRef.current) {
      fadeIn(headerRef.current, { delay: 0.2 });
    }
    if (contentRef.current) {
      fadeIn(contentRef.current, { delay: 0.4 });
    }
  }, []);

  // Don't use useRequireAuth for now to debug
  if (!isAuthenticated) {
    console.log('User not authenticated, should redirect');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Not authenticated - this should redirect</p>
        </div>
      </div>
    );
  }

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
    <div className="flex-1 min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="-ml-1 md:hidden" />
          <Separator orientation="vertical" className="mr-2 h-4 md:hidden" />
          <div ref={headerRef} className="flex-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
              Ask a Question
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Share your programming challenge with our community of experts.
            </p>
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef} className="max-w-5xl">
          <div className="bg-white rounded-2xl border shadow-sm">
            <QuestionForm />
          </div>
        </div>
      </div>
    </div>
  );
}
