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
  BarChart3,
  Clock,
  MessageSquare,
  Users,
  Activity,
  Settings,
  LogOut,
  Shield,
} from 'lucide-react';
import useAuthStore from '@/store/authStore';

const menuItems = [
  {
    title: 'Overview',
    url: '/admin',
    icon: BarChart3,
  },
  {
    title: 'Pending Review',
    url: '/admin/pending',
    icon: Clock,
    badge: '1',
    urgent: true,
  },
  {
    title: 'All Questions',
    url: '/admin/questions',
    icon: MessageSquare,
  },
  {
    title: 'User Management',
    url: '/admin/users',
    icon: Users,
  },
  {
    title: 'Activity Log',
    url: '/admin/activity',
    icon: Activity,
  },
];

export function AdminSidebar() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A';
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <Sidebar className="border-r-2 border-red-100">
      <SidebarHeader className="border-b bg-gradient-to-r from-red-50 to-pink-50">
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-red-900">Admin Panel</span>
            <span className="text-xs text-red-700">{user?.name}</span>
          </div>
          <Badge className="ml-auto bg-red-500 text-white hover:bg-red-500">
            Admin
          </Badge>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-red-800">Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className={item.urgent ? 'bg-red-50 border border-red-200 text-red-900' : ''}
                  >
                    <a href={item.url} className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <Badge 
                          className={`text-xs ${
                            item.urgent 
                              ? 'bg-red-500 text-white hover:bg-red-500' 
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
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

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
