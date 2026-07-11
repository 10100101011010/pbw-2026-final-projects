import {
  AlarmClock,
  Bell,
  CalendarClock,
  CalendarPlus,
  CalendarX,
  CheckCheck,
  CheckCircle2,
  FileUp,
  MessageSquareText,
  XCircle
} from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { EmptyState } from "../components/ui/empty-state";
import { PageHeader } from "../components/ui/page";
import { Pagination } from "../components/ui/pagination";
import { Skeleton } from "../components/ui/skeleton";
import { StatusBadge } from "../components/ui/status-badge";
import { useToast } from "../components/ui/toast-context";
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from "../features/notifications/queries";
import { cn, formatDateTime, getErrorMessage } from "../lib/utils";
import type { AppNotification, NotificationType } from "../services/types";
import { notificationTone } from "./page-helpers";

const notificationPresentation: Record<NotificationType, { icon: typeof Bell; toneClass: string }> = {
  BOOKING_CREATED: { icon: CalendarPlus, toneClass: "text-muted-foreground" },
  BOOKING_APPROVED: { icon: CheckCircle2, toneClass: "text-success" },
  BOOKING_REJECTED: { icon: XCircle, toneClass: "text-destructive" },
  BOOKING_CANCELLED: { icon: CalendarX, toneClass: "text-destructive" },
  SCHEDULE_CHANGED: { icon: CalendarClock, toneClass: "text-primary" },
  SESSION_REMINDER: { icon: AlarmClock, toneClass: "text-warning" },
  REVISION_UPLOADED: { icon: FileUp, toneClass: "text-warning" },
  FEEDBACK_ADDED: { icon: MessageSquareText, toneClass: "text-primary" }
};

export function NotificationsPage() {
  const [page, setPage] = useState(1);
  const notifications = useNotifications(page);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const { notify } = useToast();

  const markAll = async () => {
    try {
      await markAllRead.mutateAsync();
      notify({ title: "Notifications updated", variant: "success" });
    } catch (error) {
      notify({ title: "Update failed", description: getErrorMessage(error), variant: "destructive" });
    }
  };

  const markOne = async (id: string) => {
    try {
      await markRead.mutateAsync(id);
    } catch (error) {
      notify({ title: "Update failed", description: getErrorMessage(error), variant: "destructive" });
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Notifications"
        title="Notification Center"
        description="Booking decisions, reminders, schedule updates, revisions, and feedback."
        actions={
          <Button
            type="button"
            variant="outline"
            onClick={() => void markAll()}
            disabled={markAllRead.isPending || !notifications.data?.unreadCount}
          >
            <CheckCheck className="h-4 w-4" aria-hidden="true" />
            Mark All Read
          </Button>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>{notifications.data?.unreadCount ?? 0} Unread</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {notifications.isLoading ? <NotificationSkeleton /> : null}
          {notifications.isError ? (
            <EmptyState
              title="Notifications unavailable"
              description={getErrorMessage(notifications.error)}
              actionLabel="Try again"
              onAction={() => void notifications.refetch()}
            />
          ) : (
            <>
              {notifications.data?.items.map((notification) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                  onMarkRead={() => void markOne(notification.id)}
                  busy={markRead.isPending}
                />
              ))}
              {notifications.data && !notifications.data.items.length ? (
                <EmptyState title="No notifications" description="In-app notification history will appear here." />
              ) : null}
              {notifications.data ? <Pagination {...notifications.data.pagination} onPageChange={setPage} /> : null}
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}

function NotificationRow({
  notification,
  onMarkRead,
  busy
}: {
  notification: AppNotification;
  onMarkRead: () => void;
  busy: boolean;
}) {
  const { icon: Icon, toneClass } = notificationPresentation[notification.type];
  const isUnread = !notification.readAt;

  return (
    <article className={cn("rounded-lg border p-4", notificationTone(notification))}>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-3">
          <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", toneClass)} aria-hidden="true" />
          <div>
            <p className="flex items-center gap-2 font-semibold tracking-tight">
              {notification.title}
              {isUnread ? <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" /> : null}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{notification.message}</p>
            <p className="mt-2 text-xs font-semibold text-muted-foreground">{formatDateTime(notification.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={notification.type} />
          {isUnread ? (
            <Button type="button" size="sm" variant="outline" onClick={onMarkRead} disabled={busy}>
              Mark Read
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function NotificationSkeleton() {
  return (
    <>
      {[0, 1, 2].map((index) => (
        <Skeleton key={index} className="h-20 w-full" />
      ))}
    </>
  );
}
