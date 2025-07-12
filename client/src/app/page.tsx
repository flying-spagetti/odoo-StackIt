'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MainLayout from '@/components/layout/MainLayout';
import useAuthStore from '@/store/authStore';
import { apiService } from '@/utils/apiService';
import { Question } from '@/types';

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await apiService.getQuestions('approved', 1, 10);
        setQuestions(response.questions || response.items || response);
      } catch (err) {
        setError('Failed to load questions');
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {!isAuthenticated && (
          <section className="text-center py-12 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to DevForum
            </h1>
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              A curated Q&A platform where every question is reviewed by experts 
              before being published. Get quality answers from a trusted community.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Recent Questions</h2>
            {isAuthenticated && user?.role !== 'guest' && (
              <Button asChild>
                <Link href="/questions/new">Ask Question</Link>
              </Button>
            )}
          </div>

          {loading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading questions...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-4">
              {questions.map((question) => (
                <Card key={question.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          <Link href={`/questions/${question.id}`} className="hover:text-primary">
                            {question.title}
                          </Link>
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {question.content.substring(0, 200)}...
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {question.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {question.answers?.length || 0} answers • by {question.authorName} • {formatDate(question.createdAt)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && !error && questions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No questions available yet.</p>
              {isAuthenticated && user?.role !== 'guest' && (
                <Button className="mt-4" asChild>
                  <Link href="/questions/new">Ask the First Question</Link>
                </Button>
              )}
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
