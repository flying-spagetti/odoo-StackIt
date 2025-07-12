'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Plus,
  MessageSquare,
  MessageCircle,
  Bell,
  Settings,
  LogOut,
} from 'lucide-react';
import useAuthStore from '@/store/authStore';

const menuItems = [
  {
    title: 'Overview',
    url: '/dashboard',
    icon: LayoutDashboard,
    description: 'Your activity summary'
  },
  {
    title: 'Ask Question',
    url: '/dashboard/ask',
    icon: Plus,
    description: 'Submit new question',
    highlight: true
  },
  {
    title: 'My Questions',
    url: '/dashboard/questions',
    icon: MessageSquare,
    description: 'Track submissions',
    badge: '3'
  },
  {
    title: 'My Answers',
    url: '/dashboard/answers',
    icon: MessageCircle,
    description: 'Your contributions'
  },
  {
    title: 'Notifications',
    url: '/dashboard/notifications',
    icon: Bell,
    description: 'Updates & alerts',
    badge: '2'
  },
];

export function DashboardSidebar() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <Sidebar className="w-72 border-r bg-gradient-to-b from-slate-50 to-white">
      <SidebarHeader className="border-b bg-gradient-to-r from-amber-50 to-orange-50 p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 ring-2 ring-amber-200">
            <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white font-semibold">
              {getInitials(user?.name || '')}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">{user?.name}</span>
            <span className="text-sm text-amber-700">Dashboard</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className={`
                      h-auto p-4 rounded-xl transition-all duration-200 hover:bg-amber-50 hover:shadow-sm
                      ${pathname === item.url ? 'bg-gradient-to-r from-amber-100 to-orange-100 shadow-sm border border-amber-200' : ''}
                      ${item.highlight ? 'ring-2 ring-amber-200 bg-amber-50' : ''}
                    `}
                  >
                    <a href={item.url} className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className={`
                          p-2 rounded-lg transition-colors
                          ${pathname === item.url 
                            ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white' 
                            : 'bg-gray-100 text-gray-600'
                          }
                        `}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col items-start">
                          <span className={`font-medium text-sm ${pathname === item.url ? 'text-amber-900' : 'text-gray-900'}`}>
                            {item.title}
                          </span>
                          <span className={`text-xs ${pathname === item.url ? 'text-amber-700' : 'text-gray-500'}`}>
                            {item.description}
                          </span>
                        </div>
                      </div>
                      {item.badge && (
                        <Badge className="bg-amber-500 text-white hover:bg-amber-500 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4 bg-gray-50">
        <SidebarMenu className="space-y-2">
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-auto p-3 rounded-lg hover:bg-gray-100">
              <a href="/settings" className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout} 
              className="h-auto p-3 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700"
            >
              <div className="flex items-center gap-3">
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Log out</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
