'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Eye, 
  Calendar,
  User,
  CheckCircle,
  Share2
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { apiService } from '@/utils/apiService';
import { Question, Answer } from '@/types';
import useAuthStore from '@/store/authStore';

// Import highlight.js CSS for code syntax highlighting
import 'highlight.js/styles/github.css';

export default function QuestionDetailPage() {
  const params = useParams();
  const questionId = params.id as string;
  const { user, isAuthenticated } = useAuthStore();
  
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const response = await apiService.getQuestion(questionId);
        setQuestion(response);
        setAnswers(response.answers || []);
      } catch (err) {
        setError('Question not found');
        console.error('Error fetching question:', err);
      } finally {
        setLoading(false);
      }
    };

    if (questionId) {
      fetchQuestion();
    }
  }, [questionId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      <MainLayout>
        <div className="max-w-4xl mx-auto p-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !question) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto p-4 text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Question Not Found</h1>
          <p className="text-gray-600 mb-6">The question you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Questions
            </Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Questions
          </Link>
        </Button>

        {/* Question Card */}
        <Card className="shadow-sm">
          <CardHeader className="space-y-4">
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 gap-1">
                <CheckCircle className="h-3 w-3" />
                Approved
              </Badge>
              <Button variant="ghost" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>

            {/* Question Title */}
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {question.title}
            </h1>

            {/* Question Meta */}
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span className="font-medium">{question.authorName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Asked {formatTimeAgo(question.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{question.views || 0} views</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {question.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="hover:bg-gray-200 cursor-pointer">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Question Content - Rendered as Markdown */}
            <div className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  // Custom styling for code blocks
                  pre: ({ children, ...props }) => (
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto" {...props}>
                      {children}
                    </pre>
                  ),
                  // Custom styling for inline code
                  code: ({ children, className, ...props }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                        {children}
                      </code>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                  // Custom styling for tables
                  table: ({ children, ...props }) => (
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse border border-gray-300" {...props}>
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children, ...props }) => (
                    <th className="border border-gray-300 px-4 py-2 bg-gray-50 font-semibold text-left" {...props}>
                      {children}
                    </th>
                  ),
                  td: ({ children, ...props }) => (
                    <td className="border border-gray-300 px-4 py-2" {...props}>
                      {children}
                    </td>
                  ),
                }}
              >
                {question.content}
              </ReactMarkdown>
            </div>

            <Separator />

            {/* Question Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    {question.votes || 0}
                  </Button>
                  <Button variant="outline" size="sm">
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MessageSquare className="h-4 w-4" />
                  <span>{answers.length} answers</span>
                </div>
              </div>
              
              {isAuthenticated && (
                <Button className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Write Answer
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Answers Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {answers.length} Answer{answers.length !== 1 ? 's' : ''}
            </h2>
          </div>

          {answers.length === 0 ? (
            <Card className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No answers yet</h3>
              <p className="text-gray-600 mb-4">Be the first to help solve this question!</p>
              {isAuthenticated && (
                <Button>Write the first answer</Button>
              )}
            </Card>
          ) : (
            <div className="space-y-4">
              {answers.map((answer) => (
                <Card key={answer.id} className="shadow-sm" id={`answer-${answer.id}`}>
                  <CardContent className="p-6 space-y-4">
                    {/* Answer Content - Rendered as Markdown */}
                    <div className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                          // Custom styling for code blocks
                          pre: ({ children, ...props }) => (
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto" {...props}>
                              {children}
                            </pre>
                          ),
                          // Custom styling for inline code
                          code: ({ children, className, ...props }) => {
                            const isInline = !className;
                            return isInline ? (
                              <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                                {children}
                              </code>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                          // Custom styling for tables
                          table: ({ children, ...props }) => (
                            <div className="overflow-x-auto">
                              <table className="min-w-full border-collapse border border-gray-300" {...props}>
                                {children}
                              </table>
                            </div>
                          ),
                          th: ({ children, ...props }) => (
                            <th className="border border-gray-300 px-4 py-2 bg-gray-50 font-semibold text-left" {...props}>
                              {children}
                            </th>
                          ),
                          td: ({ children, ...props }) => (
                            <td className="border border-gray-300 px-4 py-2" {...props}>
                              {children}
                            </td>
                          ),
                        }}
                      >
                        {answer.content}
                      </ReactMarkdown>
                    </div>

                    <Separator />

                    {/* Answer Meta */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            {answer.votes || 0}
                          </Button>
                          <Button variant="outline" size="sm">
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                        </div>
                        {answer.isAccepted && (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Accepted Answer
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span className="font-medium">{answer.authorName}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatTimeAgo(answer.createdAt)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Related Questions */}
        <Card className="shadow-sm">
          <CardHeader>
            <h3 className="text-lg font-semibold">Related Questions</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Mock related questions */}
              <Link href="#" className="block hover:bg-gray-50 p-2 rounded transition-colors">
                <p className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  How to handle authentication in Next.js applications?
                </p>
                <p className="text-xs text-gray-500">3 answers • 45 views</p>
              </Link>
              <Link href="#" className="block hover:bg-gray-50 p-2 rounded transition-colors">
                <p className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  Best practices for API routes in Next.js 14?
                </p>
                <p className="text-xs text-gray-500">7 answers • 128 views</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
