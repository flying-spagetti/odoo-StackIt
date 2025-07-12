'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Plus, 
  MessageSquare, 
  MessageCircle, 
  Bell, 
  BarChart3,
  Users,
  Shield,
  Settings,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import useAuthStore from '@/store/authStore';

interface SidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  type?: 'user' | 'admin';
}

export default function Sidebar({ activeSection, onSectionChange, type = 'user' }: SidebarProps) {
  const { user } = useAuthStore();
  const pathname = usePathname();

  const userNavItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      description: 'Your activity summary'
    },
    {
      id: 'ask-question',
      label: 'Ask Question',
      icon: Plus,
      description: 'Submit a new question',
      highlight: true
    },
    {
      id: 'my-questions',
      label: 'My Questions',
      icon: MessageSquare,
      description: 'Track your submissions',
      badge: '3'
    },
    {
      id: 'my-answers',
      label: 'My Answers',
      icon: MessageCircle,
      description: 'Your contributions'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Updates & alerts',
      badge: '2'
    }
  ];

  const adminNavItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      description: 'Platform statistics'
    },
    {
      id: 'pending-questions',
      label: 'Pending Review',
      icon: Clock,
      description: 'Questions awaiting approval',
      badge: '1',
      urgent: true
    },
    {
      id: 'moderation',
      label: 'All Questions',
      icon: MessageSquare,
      description: 'Manage all content'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      description: 'Platform users'
    },
    {
      id: 'activity',
      label: 'Recent Activity',
      icon: BarChart3,
      description: 'Platform activity feed'
    }
  ];

  const navItems = type === 'admin' ? adminNavItems : userNavItems;

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            type === 'admin' 
              ? "bg-gradient-to-br from-red-500 to-pink-600" 
              : "bg-gradient-to-br from-blue-500 to-indigo-600"
          )}>
            {type === 'admin' ? (
              <Shield className="h-5 w-5 text-white" />
            ) : (
              <LayoutDashboard className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">
              {type === 'admin' ? 'Admin Panel' : 'Dashboard'}
            </h2>
            <p className="text-sm text-gray-500">
              {user?.name}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange?.(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200 group",
                isActive 
                  ? "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-900 shadow-sm border border-amber-200" 
                  : "hover:bg-gray-50 text-gray-700 hover:text-gray-900",
                item.urgent && !isActive && "bg-red-50 border border-red-200"
              )}
            >
              <div className={cn(
                "p-2 rounded-md transition-colors",
                isActive 
                  ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white" 
                  : item.urgent 
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
              )}>
                <Icon className="h-4 w-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={cn(
                    "font-medium text-sm",
                    isActive ? "text-amber-900" : "text-gray-900"
                  )}>
                    {item.label}
                  </p>
                  {item.badge && (
                    <Badge 
                      className={cn(
                        "text-xs",
                        item.urgent 
                          ? "bg-red-500 text-white hover:bg-red-500" 
                          : "bg-gray-200 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <p className={cn(
                  "text-xs mt-0.5",
                  isActive ? "text-amber-700" : "text-gray-500"
                )}>
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-100 mt-auto">
        {type === 'user' ? (
          <Button 
            className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700" 
            onClick={() => onSectionChange?.('ask-question')}
          >
            <Plus className="h-4 w-4" />
            Ask Question
          </Button>
        ) : (
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full gap-2 text-green-600 border-green-200 hover:bg-green-50"
              onClick={() => onSectionChange?.('pending-questions')}
            >
              <CheckCircle className="h-4 w-4" />
              Review Queue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
