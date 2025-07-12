'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, MessageSquare, User, Clock, Activity } from 'lucide-react';

interface AdminActivityProps {
  limit?: number;
}

interface ActivityItem {
  id: string;
  type: 'question_approved' | 'question_rejected' | 'new_question' | 'new_answer' | 'user_joined';
  title: string;
  description: string;
  timestamp: string;
  userId?: string;
  userName?: string;
  questionId?: string;
  questionTitle?: string;
}

export default function AdminActivity({ limit }: AdminActivityProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, [limit]);

  const fetchRecentActivity = async () => {
    try {
      setLoading(true);
      
      // Mock recent activity data
      const mockActivities: ActivityItem[] = [
        {
          id: 'act_1',
          type: 'question_approved',
          title: 'Question Approved',
          description: 'JWT authentication in Go question was approved',
          timestamp: '2024-01-15T11:00:00Z',
          userId: 'user_1',
          userName: 'John Doe',
          questionId: 'q_1',
          questionTitle: 'How to implement JWT authentication in Go?'
        },
        {
          id: 'act_2',
          type: 'new_question',
          title: 'New Question Submitted',
          description: 'Next.js App Router question needs review',
          timestamp: '2024-01-16T09:15:00Z',
          userId: 'user_3',
          userName: 'Mike Wilson',
          questionId: 'q_3',
          questionTitle: 'Next.js 14 App Router vs Pages Router'
        },
        {
          id: 'act_3',
          type: 'question_rejected',
          title: 'Question Rejected',
          description: 'Docker multi-stage builds question was rejected',
          timestamp: '2024-01-13T17:30:00Z',
          userId: 'user_1',
          userName: 'John Doe',
          questionId: 'q_4',
          questionTitle: 'Docker multi-stage builds for Go applications'
        },
        {
          id: 'act_4',
          type: 'new_answer',
          title: 'New Answer Posted',
          description: 'Answer added to MongoDB aggregation question',
          timestamp: '2024-01-14T16:20:00Z',
          userId: 'admin_1',
          userName: 'Admin User',
          questionId: 'q_2',
          questionTitle: 'MongoDB aggregation pipeline for complex queries'
        },
        {
          id: 'act_5',
          type: 'question_approved',
          title: 'Question Approved',
          description: 'FastAPI async database operations question was approved',
          timestamp: '2024-01-12T12:00:00Z',
          userId: 'user_2',
          userName: 'Jane Smith',
          questionId: 'q_5',
          questionTitle: 'FastAPI async database operations with SQLAlchemy'
        },
        {
          id: 'act_6',
          type: 'user_joined',
          title: 'New User Registered',
          description: 'Mike Wilson joined the platform',
          timestamp: '2024-01-12T09:15:00Z',
          userId: 'user_3',
          userName: 'Mike Wilson'
        }
      ];

      const sortedActivities = mockActivities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      const limitedActivities = limit ? sortedActivities.slice(0, limit) : sortedActivities;
      setActivities(limitedActivities);
    } catch (error) {
      console.error('Error fetching admin activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'question_approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'question_rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'new_question':
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case 'new_answer':
        return <MessageSquare className="h-4 w-4 text-purple-600" />;
      case 'user_joined':
        return <User className="h-4 w-4 text-indigo-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'question_approved':
        return 'border-l-green-500 bg-green-50';
      case 'question_rejected':
        return 'border-l-red-500 bg-red-50';
      case 'new_question':
        return 'border-l-blue-500 bg-blue-50';
      case 'new_answer':
        return 'border-l-purple-500 bg-purple-50';
      case 'user_joined':
        return 'border-l-indigo-500 bg-indigo-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest platform activity and admin actions
            </CardDescription>
          </div>
          {limit && activities.length > 0 && (
            <Button variant="outline" size="sm">
              View All Activity
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No recent activity.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className={`border-l-4 p-4 rounded-r-lg transition-all duration-200 hover:shadow-md ${
                  getActivityColor(activity.type)
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">{activity.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {activity.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs">
                      {activity.userName && (
                        <Badge variant="outline" className="text-xs">
                          {activity.userName}
                        </Badge>
                      )}
                      {activity.questionTitle && (
                        <Link 
                          href={`/questions/${activity.questionId}`}
                          className="text-muted-foreground truncate hover:text-blue-600 transition-colors"
                        >
                          "{activity.questionTitle}"
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
