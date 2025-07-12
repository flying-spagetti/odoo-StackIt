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
import { CheckCircle, XCircle, MessageSquare, Clock, Bell } from "lucide-react";
import notificationsData from "@/mock/data/notifications.json";

interface NotificationsProps {
  userId: string;
  limit?: number;
}

interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  questionId?: string;
  questionTitle?: string;
  answerId?: string;
  answerAuthor?: string;
  rejectionReason?: string;
  createdAt: string;
  read: boolean;
}

export default function NotificationsPanel({
  userId,
  limit,
}: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Filter notifications for the current user
        const userNotifications = notificationsData
          .filter((notif) => notif.userId === userId)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        const limitedNotifications = limit
          ? userNotifications.slice(0, limit)
          : userNotifications;
        setNotifications(limitedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId, limit]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "question_approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "question_rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "new_answer":
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case "question_pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "question_approved":
        return "border-l-green-500 bg-green-50";
      case "question_rejected":
        return "border-l-red-500 bg-red-50";
      case "new_answer":
        return "border-l-blue-500 bg-blue-50";
      case "question_pending":
        return "border-l-yellow-500 bg-yellow-50";
      default:
        return "border-l-gray-500 bg-gray-50";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
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

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {limit && notifications.length > 0 && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard?section=notifications">View All</Link>
            </Button>
          )}
        </div>
        <CardDescription>
          Stay updated on your questions and answers
        </CardDescription>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`border-l-4 p-4 rounded-r-lg transition-all duration-200 hover:shadow-md cursor-pointer ${getNotificationColor(
                  notification.type
                )} ${!notification.read ? "ring-2 ring-primary/20" : ""}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">
                        {notification.title}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    {notification.questionTitle && (
                      <div className="text-xs text-muted-foreground">
                        Question:{" "}
                        <Link
                          href={`/questions/${notification.questionId}`}
                          className="font-medium hover:text-blue-600 transition-colors"
                        >
                          {notification.questionTitle}
                        </Link>
                      </div>
                    )}
                    {!notification.read && (
                      <div className="flex justify-end mt-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                    )}
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
