'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, Clock, Search, Filter, Eye, ThumbsUp, MessageSquare } from 'lucide-react';
import { Question } from '@/types';
import { apiService } from '@/utils/apiService';

export default function QuestionModeration() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllQuestions();
  }, []);

  const fetchAllQuestions = async () => {
    try {
      setLoading(true);
      // Fetch all questions regardless of status
      const [approved, pending, rejected] = await Promise.all([
        apiService.getQuestions('approved', 1, 50),
        apiService.getQuestions('pending', 1, 50),
        apiService.getQuestions('rejected', 1, 50)
      ]);

      const allQuestions = [
        ...(approved.questions || approved.items || approved),
        ...(pending.questions || pending.items || pending),
        ...(rejected.questions || rejected.items || rejected)
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setQuestions(allQuestions);
    } catch (err) {
      setError('Failed to load questions');
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return null;
    }
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.authorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || question.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Question Moderation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse border rounded-lg p-4">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusCounts = {
    all: questions.length,
    approved: questions.filter(q => q.status === 'approved').length,
    pending: questions.filter(q => q.status === 'pending').length,
    rejected: questions.filter(q => q.status === 'rejected').length
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Question Moderation
            </CardTitle>
            <CardDescription>
              View and manage all questions across all statuses
            </CardDescription>
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredQuestions.length} questions
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions, content, or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status ({statusCounts.all})</SelectItem>
              <SelectItem value="approved">Approved ({statusCounts.approved})</SelectItem>
              <SelectItem value="pending">Pending ({statusCounts.pending})</SelectItem>
              <SelectItem value="rejected">Rejected ({statusCounts.rejected})</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <div key={question.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-1">
                  {getStatusIcon(question.status)}
                  <Link 
                    href={`/questions/${question.id}`}
                    className="font-medium line-clamp-1 hover:text-blue-600 transition-colors"
                  >
                    {question.title}
                  </Link>
                </div>
                {getStatusBadge(question.status)}
              </div>

              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {question.content}
              </p>

              {/* Rejection Reason */}
              {question.status === 'rejected' && question.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
                  <p className="text-sm text-red-800">
                    <strong>Rejection Reason:</strong> {question.rejectionReason}
                  </p>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {question.tags.slice(0, 4).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {question.tags.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{question.tags.length - 4}
                  </Badge>
                )}
              </div>

              {/* Question Meta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>by {question.authorName}</span>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {question.views || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3" />
                    {question.votes || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {question.answers?.length || 0}
                  </div>
                  <span>{formatTimeAgo(question.createdAt)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/questions/${question.id}`}>
                      View Question
                    </Link>
                  </Button>
                  {question.status === 'pending' && (
                    <Button size="sm">
                      Review
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-8">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? 'No questions match your filters' 
                : 'No questions found'
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
