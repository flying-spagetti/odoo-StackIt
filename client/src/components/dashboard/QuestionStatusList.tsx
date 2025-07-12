"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";
import { Question } from "@/types";
import { apiService } from "@/utils/apiService";

interface QuestionStatusListProps {
  userId: string;
  limit?: number;
}

export default function QuestionStatusList({
  userId,
  limit,
}: QuestionStatusListProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserQuestions = async () => {
      try {
        // Mock data for now - filter questions by userId
        const mockQuestions = [
          {
            id: "q_1",
            title: "How to implement JWT authentication in Go?",
            content:
              "I'm building a REST API in Go and need to implement JWT authentication...",
            tags: ["golang", "jwt", "authentication"],
            authorId: "user_1",
            authorName: "John Doe",
            status: "approved" as const,
            createdAt: "2024-01-15T10:30:00Z",
            updatedAt: "2024-01-15T11:00:00Z",
            views: 156,
            votes: 8,
            answers: [{ id: "a_1" }, { id: "a_2" }] as any[],
          },
          {
            id: "q_4",
            title: "Docker multi-stage builds for Go applications",
            content:
              "How can I optimize my Docker builds for Go applications...",
            tags: ["docker", "golang", "devops"],
            authorId: "user_1",
            authorName: "John Doe",
            status: "rejected" as const,
            createdAt: "2024-01-13T16:45:00Z",
            updatedAt: "2024-01-13T17:30:00Z",
            rejectionReason:
              "Question too broad. Please be more specific about your current Dockerfile and the issues you're facing.",
            views: 45,
            votes: 1,
          },
          {
            id: "q_new",
            title: "Best practices for error handling in Go",
            content:
              "What are the recommended patterns for handling errors in Go applications...",
            tags: ["golang", "error-handling", "best-practices"],
            authorId: "user_1",
            authorName: "John Doe",
            status: "pending" as const,
            createdAt: "2024-01-16T14:20:00Z",
            updatedAt: "2024-01-16T14:20:00Z",
            views: 12,
            votes: 0,
          },
        ];

        const userQuestions = mockQuestions.filter(
          (q) => q.authorId === userId
        );
        const limitedQuestions = limit
          ? userQuestions.slice(0, limit)
          : userQuestions;
        setQuestions(limitedQuestions);
      } catch (error) {
        console.error("Error fetching user questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserQuestions();
  }, [userId, limit]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending Review
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
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
            <CardTitle>My Questions</CardTitle>
            <CardDescription>
              Track the status of your submitted questions
            </CardDescription>
          </div>
          {limit && questions.length > 0 && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard?section=my-questions">View All</Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {questions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              You haven't asked any questions yet.
            </p>
            <Button asChild>
              <Link href="/dashboard?section=ask-question">
                Ask Your First Question
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <div
                key={question.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
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

                {question.status === "rejected" && question.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
                    <p className="text-sm text-red-800">
                      <strong>Rejection Reason:</strong>{" "}
                      {question.rejectionReason}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {question.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {question.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{question.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                    <span>{formatDate(question.createdAt)}</span>
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
