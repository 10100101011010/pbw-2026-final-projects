import {
  ArrowRight,
  Bell,
  BookOpenCheck,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  UsersRound,
  XCircle
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useStudentDashboard } from "../features/dashboard/queries";
import { buttonVariants } from "../components/ui/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { EmptyState } from "../components/ui/empty-state";
import { PageGrid, PageHeader } from "../components/ui/page";
import { Skeleton } from "../components/ui/skeleton";
import { StatusBadge } from "../components/ui/status-badge";
import { cn, formatDateTime, getErrorMessage } from "../lib/utils";
import type { Booking, BookingRequest } from "../services/types";
import { lecturerName, notificationTone, workspaceTitle } from "./page-helpers";

export function StudentDashboardPage() {
  const dashboard = useStudentDashboard();
  const navigate = useNavigate();

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
  const nextBooking = data.upcomingBookings[0];
  const nextPending = !nextBooking ? data.pendingRequests[0] : undefined;

  const eligibilityChecks: { label: string; passed: boolean }[] = [
    { label: "Official Gunadarma student email", passed: data.eligibility.checks.officialEmail },
    { label: `Minimum 144 SKS (${data.profile.completedSks} completed)`, passed: data.eligibility.checks.minimumSks },
    {
      label: data.profile.isSarMag ? "Penulisan Ilmiah (exempted -- Sar-Mag)" : "Penulisan Ilmiah completed",
      passed: data.eligibility.checks.piRequirement
    },
    {
      label: `Active supervisor assigned (${data.supervisors.length})`,
      passed: data.eligibility.checks.hasSupervisor
    }
  ];

  return (
    <>
      <PageHeader
        eyebrow="Mahasiswa"
        title={`Welcome, ${data.profile.fullName}`}
        description="Academic status, assigned supervisors, upcoming guidance, and recent updates."
        actions={
          <Link to="/booking" className={buttonVariants()}>
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            Book Supervision
          </Link>
        }
      />

      <PageGrid className="lg:grid-cols-[1.15fr_1fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Academic Eligibility</CardTitle>
            <StatusBadge status={data.eligibility.status} />
          </CardHeader>
          <CardContent className="space-y-4">
            {data.eligibility.reasons.length ? (
              <p className="rounded-lg bg-warning/15 p-3 text-sm font-medium text-warning">{data.eligibility.reasons[0]}</p>
            ) : (
              <p className="flex items-center gap-2 rounded-lg bg-success/10 p-3 text-sm font-medium text-success">
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                Eligible for supervision booking
              </p>
            )}
            <div className="grid gap-2.5">
              {eligibilityChecks.map((check) => (
                <div key={check.label} className="flex items-center gap-2.5 text-sm">
                  {check.passed ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
                  )}
                  <span className={check.passed ? "text-foreground" : "text-muted-foreground"}>{check.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Supervision</CardTitle>
          </CardHeader>
          <CardContent>
            {nextBooking ? (
              <NextSessionSpotlight booking={nextBooking} />
            ) : nextPending ? (
              <NextRequestSpotlight request={nextPending} />
            ) : (
              <EmptyState
                illustration="bimbingan-1"
                title="No upcoming supervision"
                description="Book a slot with your assigned supervisor to get started."
                actionLabel="Book Supervision"
                onAction={() => navigate("/booking")}
              />
            )}
          </CardContent>
        </Card>
      </PageGrid>

      <PageGrid className="mt-5 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Student Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">NPM</p>
              <p className="font-semibold tracking-tight">{data.profile.npm}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Study Program</p>
              <p className="font-semibold tracking-tight">{data.profile.studyProgram}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Academic Track</p>
              <p className="font-semibold tracking-tight">{data.profile.isSarMag ? "Sarjana-Magister" : "Regular"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assigned Supervisors</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {data.supervisors.length ? (
              data.supervisors.map((assignment) => (
                <div key={assignment.id} className="rounded-lg border bg-muted/25 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-bold text-primary">
                    <UsersRound className="h-4 w-4" aria-hidden="true" />
                    {assignment.order === "FIRST" ? "Supervisor 1" : "Supervisor 2"}
                  </div>
                  <p className="font-semibold tracking-tight">{lecturerName(assignment.lecturer)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{assignment.lecturer.department}</p>
                  <p className="mt-3 text-sm">{assignment.lecturer.consultationNotes ?? assignment.lecturer.user?.email ?? "Consultation notes unavailable."}</p>
                </div>
              ))
            ) : (
              <div className="md:col-span-2">
                <EmptyState title="No supervisor assigned" description="Your academic supervisor assignment is not available in GTGS yet." />
              </div>
            )}
          </CardContent>
        </Card>
      </PageGrid>

      <PageGrid className="mt-5 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Supervision</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {data.upcomingBookings.length ? (
              data.upcomingBookings.map((booking) => (
                <div key={booking.id} className="rounded-lg border p-3">
                  <p className="font-semibold tracking-tight">{lecturerName(booking.lecturer)}</p>
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
              <EmptyState
                icon={<CalendarDays className="h-6 w-6" aria-hidden="true" />}
                title="No upcoming supervision"
                description="Approved supervision sessions will appear here."
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {data.pendingRequests.length ? (
              data.pendingRequests.map((request) => (
                <div key={request.id} className="rounded-lg border p-3">
                  <p className="font-semibold tracking-tight">{lecturerName(request.lecturer)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{formatDateTime(request.requestedStartAt)}</p>
                  <div className="mt-2">
                    <StatusBadge status={request.status} />
                  </div>
                </div>
              ))
            ) : (
              <EmptyState title="No pending requests" description="Requests awaiting lecturer approval will appear here." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3 text-sm font-semibold">
              <Bell className="h-4 w-4 text-primary" aria-hidden="true" />
              {data.unreadCount} unread notification{data.unreadCount === 1 ? "" : "s"}
            </div>
            {data.notifications.slice(0, 4).map((notification) => (
              <div key={notification.id} className={cn("rounded-lg border p-3", notificationTone(notification))}>
                <p className="text-sm font-bold">{notification.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
              </div>
            ))}
            <Link to="/notifications" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full")}>
              View Notifications
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </CardContent>
        </Card>
      </PageGrid>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Recent Session Workspaces</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {data.recentWorkspaces.length ? (
            data.recentWorkspaces.map((workspace) => {
              const latestFeedback = workspace.feedback?.find((item) => item.visibility === "STUDENT_VISIBLE");
              return (
                <Link key={workspace.id} to="/workspace" className="rounded-lg border p-4 transition-colors duration-150 hover:bg-muted/40">
                  <div className="mb-3 flex items-center gap-2 text-sm font-bold text-primary">
                    <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
                    {workspaceTitle(workspace, "STUDENT")}
                  </div>
                  <p className="text-sm text-muted-foreground">{formatDateTime(workspace.createdAt)}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <StatusBadge status={workspace.status} />
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                      <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                      {workspace.revisions?.length ?? 0} revisions
                    </span>
                  </div>
                  {latestFeedback ? (
                    <p className="mt-3 line-clamp-2 border-t pt-3 text-xs leading-relaxed text-muted-foreground">
                      &ldquo;{latestFeedback.feedback}&rdquo;
                    </p>
                  ) : null}
                </Link>
              );
            })
          ) : (
            <EmptyState title="No session workspace yet" description="Approved supervision sessions will create workspaces for notes and revisions." />
          )}
        </CardContent>
      </Card>
    </>
  );
}

function NextSessionSpotlight({ booking }: { booking: Booking }) {
  return (
    <div className="rounded-lg border bg-primary/5 p-4">
      <div className="flex items-center gap-2 text-sm font-bold text-primary">
        <CalendarClock className="h-4 w-4" aria-hidden="true" />
        Confirmed session
      </div>
      <p className="mt-3 font-display text-lg font-semibold tracking-tight">{lecturerName(booking.lecturer)}</p>
      <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" aria-hidden="true" />
        {formatDateTime(booking.startAt)}
      </p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <StatusBadge status={booking.status} />
        <Link to="/booking" className="text-sm font-semibold text-primary transition-colors duration-150 hover:text-primary/80">
          View all bookings
        </Link>
      </div>
    </div>
  );
}

function NextRequestSpotlight({ request }: { request: BookingRequest }) {
  return (
    <div className="rounded-lg border bg-warning/10 p-4">
      <div className="flex items-center gap-2 text-sm font-bold text-warning">
        <CalendarClock className="h-4 w-4" aria-hidden="true" />
        Awaiting lecturer approval
      </div>
      <p className="mt-3 font-display text-lg font-semibold tracking-tight">{lecturerName(request.lecturer)}</p>
      <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" aria-hidden="true" />
        {formatDateTime(request.requestedStartAt)}
      </p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <StatusBadge status={request.status} />
        <Link to="/booking" className="text-sm font-semibold text-primary transition-colors duration-150 hover:text-primary/80">
          View all requests
        </Link>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
      <PageGrid className="lg:grid-cols-[1.15fr_1fr]">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </PageGrid>
      <PageGrid className="mt-5 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardContent className="space-y-3 pt-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="grid gap-3 pt-6 md:grid-cols-2">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </CardContent>
        </Card>
      </PageGrid>
      <PageGrid className="mt-5 lg:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <Card key={index}>
            <CardContent className="space-y-3 pt-6">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </PageGrid>
    </>
  );
}
