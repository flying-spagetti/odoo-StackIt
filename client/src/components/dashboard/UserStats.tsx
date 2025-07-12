'use client';

import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { CheckCircle, Clock, XCircle, MessageSquare, TrendingUp, Award } from 'lucide-react';
import { staggerIn } from '@/utils/animations';

interface UserStatsProps {
  userId: string;
}

interface Stats {
  questionsAsked: number;
  questionsApproved: number;
  questionsRejected: number;
  questionsPending: number;
  answersGiven: number;
  totalViews: number;
  totalVotes: number;
}

export default function UserStats({ userId }: UserStatsProps) {
  const [stats, setStats] = useState<Stats>({
    questionsAsked: 0,
    questionsApproved: 0,
    questionsRejected: 0,
    questionsPending: 0,
    answersGiven: 0,
    totalViews: 0,
    totalVotes: 0
  });
  const [loading, setLoading] = useState(true);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Mock stats for now - replace with real API call
        const mockStats = {
          questionsAsked: 5,
          questionsApproved: 3,
          questionsRejected: 1,
          questionsPending: 1,
          answersGiven: 12,
          totalViews: 456,
          totalVotes: 23
        };
        setStats(mockStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  useEffect(() => {
    if (!loading && statsRef.current) {
      const statCards = statsRef.current.querySelectorAll('.stat-card');
      staggerIn(statCards, { delay: 0.3 });
    }
  }, [loading]);

  const primaryStats = [
    {
      title: 'Questions Asked',
      value: stats.questionsAsked,
      icon: MessageSquare,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Approved',
      value: stats.questionsApproved,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Answers Given',
      value: stats.answersGiven,
      icon: Award,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      title: 'Total Views',
      value: stats.totalViews,
      icon: TrendingUp,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700'
    }
  ];

  const secondaryStats = [
    {
      title: 'Pending Review',
      value: stats.questionsPending,
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: 'Rejected',
      value: stats.questionsRejected,
      icon: XCircle,
      color: 'text-red-600'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={statsRef} className="space-y-8">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {primaryStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={`stat-card group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-105 cursor-pointer ${stat.bgColor}`}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} mb-4`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className={`text-3xl font-bold ${stat.textColor} mb-1`}>
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  {stat.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Stats */}
      {(stats.questionsPending > 0 || stats.questionsRejected > 0) && (
        <div className="flex items-center justify-center gap-8 py-6 bg-gray-50 rounded-2xl">
          {secondaryStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="stat-card flex items-center gap-3">
                <Icon className={`h-5 w-5 ${stat.color}`} />
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Achievement Badge */}
      <div className="stat-card text-center py-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full">
          <Award className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-800">
            {stats.questionsApproved > 5 ? 'Expert Contributor' : 
             stats.questionsApproved > 2 ? 'Active Member' : 
             'New Member'}
          </span>
        </div>
      </div>
    </div>
  );
}
