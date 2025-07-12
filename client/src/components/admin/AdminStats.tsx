'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';

interface AdminStatsData {
  totalUsers: number;
  totalQuestions: number;
  pendingQuestions: number;
  approvedQuestions: number;
  rejectedQuestions: number;
  totalAnswers: number;
  activeUsers: number;
  questionsToday: number;
}

export default function AdminStats() {
  const [stats, setStats] = useState<AdminStatsData>({
    totalUsers: 0,
    totalQuestions: 0,
    pendingQuestions: 0,
    approvedQuestions: 0,
    rejectedQuestions: 0,
    totalAnswers: 0,
    activeUsers: 0,
    questionsToday: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        // Mock admin stats
        const mockStats = {
          totalUsers: 4,
          totalQuestions: 5,
          pendingQuestions: 1,
          approvedQuestions: 3,
          rejectedQuestions: 1,
          totalAnswers: 4,
          activeUsers: 3,
          questionsToday: 2
        };
        setStats(mockStats);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+2 this week'
    },
    {
      title: 'Pending Questions',
      value: stats.pendingQuestions,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      change: 'Needs review',
      urgent: true
    },
    {
      title: 'Approved Questions',
      value: stats.approvedQuestions,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+1 today'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      change: 'Last 24h'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-8 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Platform Overview</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={stat.title} 
              className={`hover:shadow-md transition-all duration-200 hover:scale-105 ${
                stat.urgent ? 'ring-2 ring-yellow-200 bg-yellow-50/50' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  {stat.urgent && (
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
