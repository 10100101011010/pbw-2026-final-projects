import { Bell, CalendarClock, CalendarDays, Check, Clock, FileText, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { buttonVariants } from "../components/ui/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { EmptyState } from "../components/ui/empty-state";
import { PageGrid, PageHeader } from "../components/ui/page";
import { Skeleton } from "../components/ui/skeleton";
import { StatusBadge } from "../components/ui/status-badge";
import { useToast } from "../components/ui/toast-context";
import { useApproveBooking, useRejectBooking } from "../features/bookings/queries";
import { useLecturerDashboard } from "../features/dashboard/queries";
import { cn, formatDate, formatDateTime, getErrorMessage } from "../lib/utils";
import { notificationTone, studentName, workspaceTitle } from "./page-helpers";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function LecturerDashboardPage() {
  const dashboard = useLecturerDashboard();
  const approve = useApproveBooking();
  const reject = useRejectBooking();
  const { notify } = useToast();

  const approveRequest = async (id: string) => {
    try {
      await approve.mutateAsync(id);
      notify({ title: "Request approved", description: "The supervision session is now confirmed.", variant: "success" });
    } catch (error) {
      notify({ title: "Approval failed", description: getErrorMessage(error), variant: "destructive" });
    }
  };

  const rejectRequest = async (id: string) => {
    try {
      await reject.mutateAsync({ id });
      notify({ title: "Request rejected", description: "The student has been notified.", variant: "success" });
    } catch (error) {
      notify({ title: "Rejection failed", description: getErrorMessage(error), variant: "destructive" });
    }
  };

  if (dashboard.isLoading) return <DashboardSkeleton />;

  if (dashboard.isError) {
    return (
      <EmptyState
        title="Dashboard unavailable"
        description={getErrorMessage(dashboard.error)}
        actionLabel="Try again"
        onAction={() => void dashboard.refetch()}
      />
    );
  }

  const data = dashboard.data!;

  return (
    <>
      <PageHeader
        eyebrow="Dosen"
        title={`Welcome, ${data.profile.academicTitle} ${data.profile.fullName}`}
        description="Today's sessions, pending requests, availability windows, and recent supervision records."
        actions={
          <Link to="/availability" className={buttonVariants()}>
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            Manage Availability
          </Link>
        }
      />

      <Card className={cn(data.pendingRequests.length ? "border-warning/40 bg-warning/5" : undefined)}>
        <CardHeader className="flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Pending Booking Requests</CardTitle>
          {data.pendingRequests.length ? (
            <span className="rounded-full bg-warning px-2.5 py-0.5 text-xs font-bold text-warning-foreground">
              {data.pendingRequests.length} awaiting review
            </span>
          ) : null}
        </CardHeader>
        <CardContent className="grid gap-3">
          {data.pendingRequests.length ? (
            data.pendingRequests.map((request) => (
              <div
                key={request.id}
                className="flex flex-col gap-3 rounded-lg border bg-card p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-semibold tracking-tight">{studentName(request.student)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{formatDateTime(request.requestedStartAt)}</p>
                  {request.discussionTopic ? <p className="mt-2 text-sm">{request.discussionTopic}</p> : null}
                </div>
                <div className="flex gap-2">
                  <Button type="button" size="sm" onClick={() => void approveRequest(request.id)} disabled={approve.isPending}>
                    <Check className="h-4 w-4" aria-hidden="true" />
                    Approve
                  </Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => void rejectRequest(request.id)} disabled={reject.isPending}>
                    <X className="h-4 w-4" aria-hidden="true" />
                    Reject
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              illustration="bimbingan-2"
              title="You're all caught up"
              description="New student booking requests will appear here for review."
            />
          )}
        </CardContent>
      </Card>

      <PageGrid className="mt-5 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-3xl font-bold text-primary">{data.todayBookings.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">approved supervision sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-3xl font-bold text-primary">{data.availabilityWindows.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">active schedule windows</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-3xl font-bold text-primary">{data.unreadCount}</p>
            <p className="mt-1 text-sm text-muted-foreground">unread updates</p>
          </CardContent>
        </Card>
      </PageGrid>

      <PageGrid className="mt-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {data.todayBookings.length ? (
              data.todayBookings.map((booking) => (
                <div key={booking.id} className="rounded-lg border p-3">
                  <p className="font-semibold tracking-tight">{studentName(booking.student)}</p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    {formatDateTime(booking.startAt)}
                  </p>
                  <div className="mt-2">
                    <StatusBadge status={booking.status} />
                  </div>
                </div>
              ))
            ) : (
              <EmptyState title="No sessions today" description="Approved sessions for today will appear here." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Supervision</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {data.upcomingBookings.map((booking) => (
              <div key={booking.id} className="rounded-lg border p-3">
                <p className="font-semibold tracking-tight">{studentName(booking.student)}</p>
                <p className="mt-1 text-sm text-muted-foreground">{formatDateTime(booking.startAt)}</p>
              </div>
            ))}
            {!data.upcomingBookings.length ? <EmptyState title="No upcoming sessions" description="Confirmed supervision sessions will appear here." /> : null}
          </CardContent>
        </Card>
      </PageGrid>

      <PageGrid className="mt-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Availability Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {data.availabilityWindows.map((window) => (
              <div key={window.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold tracking-tight">{window.windowType === "RECURRING" ? "Recurring" : "One-time"}</p>
                  <StatusBadge status={window.isActive ? "AVAILABLE" : "INACTIVE"} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {window.specificDate ? formatDate(window.specificDate) : dayNames[window.dayOfWeek ?? 0]} | {window.startTime}-{window.endTime}
                </p>
              </div>
            ))}
            {!data.availabilityWindows.length ? <EmptyState title="No availability windows" description="Create availability windows before students can request slots." /> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3 text-sm font-semibold">
              <Bell className="h-4 w-4 text-primary" aria-hidden="true" />
              {data.unreadCount} unread notification{data.unreadCount === 1 ? "" : "s"}
            </div>
            {data.notifications.slice(0, 3).map((notification) => (
              <div key={notification.id} className={cn("rounded-lg border p-3", notificationTone(notification))}>
                <p className="text-sm font-bold">{notification.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </PageGrid>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Recent Session Workspaces</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {data.recentWorkspaces.length ? (
            data.recentWorkspaces.map((workspace) => (
              <Link key={workspace.id} to="/workspace" className="rounded-lg border p-4 transition-colors duration-150 hover:bg-muted/40">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-primary">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  {workspaceTitle(workspace, "LECTURER")}
                </div>
                <p className="text-sm text-muted-foreground">{formatDateTime(workspace.createdAt)}</p>
                <div className="mt-3 flex items-center gap-2">
                  <StatusBadge status={workspace.status} />
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                    <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                    Workspace
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <EmptyState title="No workspaces yet" description="Approved sessions will create session workspaces automatically." />
          )}
        </CardContent>
      </Card>
    </>
  );
}

function DashboardSkeleton() {
  return (
    <>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-72" />
        </div>
        <Skeleton className="h-10 w-44" />
      </div>
      <Card>
        <CardContent className="space-y-3 pt-6">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
      <PageGrid className="mt-5 lg:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <Card key={index}>
            <CardContent className="space-y-2 pt-6">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </PageGrid>
      <PageGrid className="mt-5 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-3 pt-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 pt-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      </PageGrid>
    </>
  );
}
