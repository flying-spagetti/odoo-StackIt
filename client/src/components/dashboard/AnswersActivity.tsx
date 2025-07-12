'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageSquare, CheckCircle, Eye } from 'lucide-react';
import { Answer } from '@/types';
import answersData from '@/mock/data/answers.json';

interface AnswersActivityProps {
  userId: string;
}

interface AnswerWithQuestion extends Answer {
  questionTitle: string;
  questionTags: string[];
}

export default function AnswersActivity({ userId }: AnswersActivityProps) {
  const [answers, setAnswers] = useState<AnswerWithQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAnswers = async () => {
      try {
        // Mock data - filter answers by userId and add question info
        const userAnswers = answersData
          .filter(answer => answer.authorId === userId)
          .map(answer => ({
            ...answer,
            questionTitle: getQuestionTitle(answer.questionId),
            questionTags: getQuestionTags(answer.questionId)
          }))
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setAnswers(userAnswers);
      } catch (error) {
        console.error('Error fetching user answers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAnswers();
  }, [userId]);

  // Helper functions to get question info (in real app, this would come from API)
  const getQuestionTitle = (questionId: string) => {
    const questionTitles: { [key: string]: string } = {
      'q_1': 'How to implement JWT authentication in Go?',
      'q_2': 'MongoDB aggregation pipeline for complex queries',
      'q_5': 'FastAPI async database operations with SQLAlchemy'
    };
    return questionTitles[questionId] || 'Unknown Question';
  };

  const getQuestionTags = (questionId: string) => {
    const questionTags: { [key: string]: string[] } = {
      'q_1': ['golang', 'jwt', 'authentication'],
      'q_2': ['mongodb', 'aggregation', 'database'],
      'q_5': ['fastapi', 'python', 'sqlalchemy']
    };
    return questionTags[questionId] || [];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Answers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
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
        <CardTitle>My Answers</CardTitle>
        <CardDescription>
          Answers you've provided to community questions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {answers.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">You haven't answered any questions yet.</p>
            <Button asChild>
              <Link href="/">Browse Questions to Answer</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {answers.map((answer) => (
              <div key={answer.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Link 
                        href={`/questions/${answer.questionId}`}
                        className="font-medium text-primary hover:text-blue-800 transition-colors line-clamp-1"
                      >
                        {answer.questionTitle}
                      </Link>
                      {answer.isAccepted && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Accepted
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {answer.questionTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-3 mb-3">
                  <p className="text-sm text-muted-foreground mb-2">Your Answer:</p>
                  <div className="text-sm">
                    {truncateContent(answer.content)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      {answer.votes || 0} votes
                    </div>
                    <span>Answered on {formatDate(answer.createdAt)}</span>
                  </div>
                  
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/questions/${answer.questionId}#answer-${answer.id}`}>
                      View Question
                    </Link>
                  </Button>
                </div>
              </div>
            ))}

            {/* Summary Stats */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{answers.length}</div>
                  <div className="text-sm text-muted-foreground">Total Answers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {answers.filter(a => a.isAccepted).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Accepted</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {answers.reduce((sum, a) => sum + (a.votes || 0), 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Votes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round((answers.filter(a => a.isAccepted).length / answers.length) * 100) || 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">Accept Rate</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
