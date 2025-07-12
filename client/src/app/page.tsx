'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, MessageSquare, TrendingUp, CheckCircle } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import useAuthStore from '@/store/authStore';
import { apiService } from '@/utils/apiService';
import { Question } from '@/types';

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-redirect admin users to admin panel
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      router.push('/admin');
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await apiService.getQuestions('approved', 1, 6);
        setQuestions(response.questions || response.items || response);
      } catch (err) {
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        {!isAuthenticated && (
          <section className="py-20 px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Get Expert Answers to Your Code Questions
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                A curated Q&A platform where every question is reviewed by experts before publication.
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Search Section */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-3 text-lg"
              />
            </div>
          </div>
        </section>

        {/* Questions Section */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Recent Questions</h2>
              {isAuthenticated && user?.role !== 'guest' && (
                <Button asChild>
                  <Link href="/dashboard/ask">Ask Question</Link>
                </Button>
              )}
            </div>

            {loading && (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}

            {!loading && (
              <div className="space-y-4">
                {questions.map((question) => (
                  <Card key={question.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">
                            <Link href={`/questions/${question.id}`} className="hover:text-blue-600">
                              {question.title}
                            </Link>
                          </CardTitle>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                            {question.content.substring(0, 150)}...
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              {question.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                {question.answers?.length || 0}
                              </div>
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                {question.views || 0}
                              </div>
                              <span>{formatTimeAgo(question.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className="ml-4">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approved
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}

            {!loading && questions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No questions available yet.</p>
                {isAuthenticated && user?.role !== 'guest' && (
                  <Button asChild>
                    <Link href="/dashboard/ask">Ask the First Question</Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
