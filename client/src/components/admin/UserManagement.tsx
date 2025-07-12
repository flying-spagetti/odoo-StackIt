'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Search, MessageSquare, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { User } from '@/types';
import { apiService } from '@/utils/apiService';
import useAuthStore from '@/store/authStore';

interface UserWithStats extends User {
  stats: {
    questionsAsked: number;
    questionsApproved: number;
    questionsRejected: number;
    answersGiven: number;
  };
  createdAt: string;
}

export default function UserManagement() {
  const { getToken } = useAuthStore();
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        setError('Authentication required');
        return;
      }

      // Mock user data with stats
      const mockUsers = [
        {
          userId: 'user_1',
          email: 'john.doe@example.com',
          name: 'John Doe',
          role: 'user' as const,
          createdAt: '2024-01-10T10:00:00Z',
          stats: {
            questionsAsked: 5,
            questionsApproved: 3,
            questionsRejected: 2,
            answersGiven: 12
          }
        },
        {
          userId: 'user_2',
          email: 'jane.smith@example.com',
          name: 'Jane Smith',
          role: 'user' as const,
          createdAt: '2024-01-08T14:30:00Z',
          stats: {
            questionsAsked: 8,
            questionsApproved: 6,
            questionsRejected: 2,
            answersGiven: 25
          }
        },
        {
          userId: 'user_3',
          email: 'mike.wilson@example.com',
          name: 'Mike Wilson',
          role: 'user' as const,
          createdAt: '2024-01-12T09:15:00Z',
          stats: {
            questionsAsked: 3,
            questionsApproved: 1,
            questionsRejected: 1,
            answersGiven: 8
          }
        },
        {
          userId: 'admin_1',
          email: 'admin@devforum.com',
          name: 'Admin User',
          role: 'admin' as const,
          createdAt: '2024-01-01T00:00:00Z',
          stats: {
            questionsAsked: 2,
            questionsApproved: 2,
            questionsRejected: 0,
            answersGiven: 45
          }
        }
      ];

      setUsers(mockUsers);
    } catch (err) {
      setError('Failed to load users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Admin</Badge>;
      case 'user':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">User</Badge>;
      default:
        return <Badge variant="secondary">Guest</Badge>;
    }
  };

  const getActivityLevel = (stats: UserWithStats['stats']) => {
    const totalActivity = stats.questionsAsked + stats.answersGiven;
    if (totalActivity >= 20) return { level: 'High', color: 'text-green-600' };
    if (totalActivity >= 10) return { level: 'Medium', color: 'text-yellow-600' };
    if (totalActivity >= 5) return { level: 'Low', color: 'text-orange-600' };
    return { level: 'New', color: 'text-gray-600' };
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse border rounded-lg p-4">
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
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>
              Manage platform users and view their activity
            </CardDescription>
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredUsers.length} users
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="flex items-center gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map((user) => {
            const activity = getActivityLevel(user.stats);
            return (
              <div key={user.userId} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{user.name}</h3>
                      {getRoleBadge(user.role)}
                      <Badge variant="outline" className={activity.color}>
                        {activity.level} Activity
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Joined {formatDate(user.createdAt)}
                    </div>
                  </div>
                </div>

                {/* User Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <MessageSquare className="h-3 w-3 text-blue-600" />
                      <span className="text-sm font-medium">{user.stats.questionsAsked}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Questions</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span className="text-sm font-medium">{user.stats.questionsApproved}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Approved</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <XCircle className="h-3 w-3 text-red-600" />
                      <span className="text-sm font-medium">{user.stats.questionsRejected}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Rejected</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <MessageSquare className="h-3 w-3 text-purple-600" />
                      <span className="text-sm font-medium">{user.stats.answersGiven}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Answers</p>
                  </div>
                </div>

                {/* User Actions */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <div className="text-xs text-muted-foreground">
                    User ID: {user.userId}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                    {user.role !== 'admin' && (
                      <Button variant="outline" size="sm">
                        View Questions
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredUsers.length === 0 && searchTerm && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No users found matching "{searchTerm}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
