'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Clock, User, Calendar, Eye } from 'lucide-react';
import { Question } from '@/types';
import { apiService } from '@/utils/apiService';
import useAuthStore from '@/store/authStore';

interface PendingQuestionsProps {
  limit?: number;
}

export default function PendingQuestions({ limit }: PendingQuestionsProps) {
  const { getToken } = useAuthStore();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<{ [key: string]: string }>({});
  const [showRejectForm, setShowRejectForm] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPendingQuestions();
  }, [limit]);

  const fetchPendingQuestions = async () => {
    try {
      setLoading(true);
      const response = await apiService.getQuestions('pending', 1, limit || 50);
      setQuestions(response.questions || response.items || response);
    } catch (err) {
      setError('Failed to load pending questions');
      console.error('Error fetching pending questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (questionId: string) => {
    const token = getToken();
    if (!token) {
      setError('Authentication required');
      return;
    }

    setProcessingId(questionId);
    setError('');
    setSuccess('');

    try {
      await apiService.approveQuestion(questionId, token);
      setSuccess('Question approved successfully!');
      
      // Remove from pending list
      setQuestions(prev => prev.filter(q => q.id !== questionId));
    } catch (err) {
      setError('Failed to approve question');
      console.error('Error approving question:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (questionId: string) => {
    const token = getToken();
    if (!token) {
      setError('Authentication required');
      return;
    }

    const reason = rejectionReason[questionId];
    if (!reason?.trim()) {
      setError('Please provide a rejection reason');
      return;
    }

    setProcessingId(questionId);
    setError('');
    setSuccess('');

    try {
      await apiService.rejectQuestion(questionId, reason, token);
      setSuccess('Question rejected with feedback sent to user');
      
      // Remove from pending list
      setQuestions(prev => prev.filter(q => q.id !== questionId));
      setShowRejectForm(null);
      setRejectionReason(prev => ({ ...prev, [questionId]: '' }));
    } catch (err) {
      setError('Failed to reject question');
      console.error('Error rejecting question:', err);
    } finally {
      setProcessingId(null);
    }
  };

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
          <CardTitle>Pending Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              Pending Questions
              {questions.length > 0 && (
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                  {questions.length}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Questions awaiting admin approval
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-4">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {questions.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <p className="text-muted-foreground">All caught up! No pending questions.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((question) => (
              <div key={question.id} className="border rounded-lg p-6 space-y-4">
                {/* Question Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link 
                      href={`/questions/${question.id}`}
                      className="text-lg font-semibold mb-2 hover:text-blue-600 transition-colors block"
                    >
                      {question.title}
                    </Link>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {question.authorName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(question.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(question.createdAt)}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    Pending Review
                  </Badge>
                </div>

                {/* Question Content */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm whitespace-pre-wrap line-clamp-4">
                    {question.content}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {question.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Rejection Form */}
                {showRejectForm === question.id && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
                    <label className="text-sm font-medium text-red-800">
                      Rejection Reason (will be sent to user):
                    </label>
                    <Textarea
                      value={rejectionReason[question.id] || ''}
                      onChange={(e) => setRejectionReason(prev => ({
                        ...prev,
                        [question.id]: e.target.value
                      }))}
                      placeholder="Explain why this question needs improvement..."
                      rows={3}
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleApprove(question.id)}
                      disabled={processingId === question.id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {processingId === question.id ? 'Approving...' : 'Approve'}
                    </Button>
                    
                    {showRejectForm === question.id ? (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleReject(question.id)}
                          disabled={processingId === question.id}
                          variant="destructive"
                        >
                          {processingId === question.id ? 'Rejecting...' : 'Confirm Reject'}
                        </Button>
                        <Button
                          onClick={() => setShowRejectForm(null)}
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setShowRejectForm(question.id)}
                        variant="destructive"
                        disabled={processingId === question.id}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    )}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Question ID: {question.id}
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
