import { Check, Filter, Plus, RefreshCw, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { EmptyState } from "../components/ui/empty-state";
import { Field, Input, Select, Textarea } from "../components/ui/input";
import { PageGrid, PageHeader } from "../components/ui/page";
import { Pagination } from "../components/ui/pagination";
import { Skeleton } from "../components/ui/skeleton";
import { StatusBadge } from "../components/ui/status-badge";
import { useToast } from "../components/ui/toast-context";
import { useStudentSupervisors, useSupervisorSlots } from "../features/availability/queries";
import {
  useApproveBooking,
  useBookings,
  useCancelBooking,
  useCompleteBooking,
  useCreateBooking,
  useRejectBooking
} from "../features/bookings/queries";
import { useAuth } from "../features/auth/auth-context";
import { addDays, cn, formatDate, formatDateInput, formatDateTime, getErrorMessage } from "../lib/utils";
import type { Booking, BookingRequest } from "../services/types";
import { bookingTitle, requestTitle } from "./page-helpers";

const bookingStatuses = ["ALL", "APPROVED", "CANCELLED", "COMPLETED"] as const;

export function BookingPage() {
  const { role } = useAuth();
  const { notify } = useToast();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<(typeof bookingStatuses)[number]>("ALL");
  const bookings = useBookings(page, status === "ALL" ? undefined : status);

  const approve = useApproveBooking();
  const reject = useRejectBooking();
  const cancel = useCancelBooking();
  const complete = useCompleteBooking();

  const handleStatusChange = (next: (typeof bookingStatuses)[number]) => {
    setStatus(next);
    setPage(1);
  };

  const runAction = async (action: Promise<unknown>, success: string) => {
    try {
      await action;
      notify({ title: success, variant: "success" });
    } catch (error) {
      notify({ title: "Action failed", description: getErrorMessage(error), variant: "destructive" });
    }
  };

  if (!role) return null;

  return (
    <>
      <PageHeader
        eyebrow="Booking"
        title={role === "STUDENT" ? "Supervision Booking" : "Booking Review"}
        description="Booking requests, approvals, cancellations, and confirmed supervision sessions."
        actions={
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Select
              value={status}
              onChange={(event) => handleStatusChange(event.target.value as (typeof bookingStatuses)[number])}
              aria-label="Filter booking status"
            >
              {bookingStatuses.map((item) => (
                <option key={item} value={item}>
                  {item === "ALL" ? "All bookings" : item}
                </option>
              ))}
            </Select>
          </div>
        }
      />

      {role === "STUDENT" ? <StudentBookingForm /> : null}

      {bookings.isError ? (
        <EmptyState
          title="Bookings unavailable"
          description={getErrorMessage(bookings.error)}
          actionLabel="Try again"
          onAction={() => void bookings.refetch()}
        />
      ) : (
        <PageGrid className="mt-5 lg:grid-cols-[1fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Confirmed Bookings</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {bookings.isLoading ? <RowSkeletons count={3} /> : null}
              {bookings.data?.bookings.map((booking) => (
                <BookingRow
                  key={booking.id}
                  booking={booking}
                  viewerRole={role}
                  onCancel={() => void runAction(cancel.mutateAsync({ id: booking.id }), "Booking cancelled")}
                  onComplete={role === "LECTURER" ? () => void runAction(complete.mutateAsync(booking.id), "Session completed") : undefined}
                  busy={cancel.isPending || complete.isPending}
                />
              ))}
              {bookings.data && !bookings.data.bookings.length ? (
                <EmptyState title="No confirmed bookings" description="Approved, cancelled, and completed supervision sessions will appear here." />
              ) : null}
              {bookings.data ? <Pagination {...bookings.data.pagination} onPageChange={setPage} /> : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Requests</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {bookings.isLoading ? <RowSkeletons count={2} /> : null}
              {bookings.data?.recentRequests.map((request) => (
                <RequestRow
                  key={request.id}
                  request={request}
                  viewerRole={role}
                  onApprove={role === "LECTURER" && request.status === "PENDING" ? () => void runAction(approve.mutateAsync(request.id), "Request approved") : undefined}
                  onReject={
                    role === "LECTURER" && request.status === "PENDING"
                      ? () => void runAction(reject.mutateAsync({ id: request.id }), "Request rejected")
                      : undefined
                  }
                  onCancel={
                    role === "STUDENT" && request.status === "PENDING"
                      ? () => void runAction(cancel.mutateAsync({ id: request.id }), "Request cancelled")
                      : undefined
                  }
                  busy={approve.isPending || reject.isPending || cancel.isPending}
                />
              ))}
              {bookings.data && !bookings.data.recentRequests.length ? (
                <EmptyState title="No booking requests" description="Student requests awaiting decisions will appear here." />
              ) : null}
            </CardContent>
          </Card>
        </PageGrid>
      )}
    </>
  );
}

function RowSkeletons({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className="h-20 w-full" />
      ))}
    </>
  );
}

function StudentBookingForm() {
  const { notify } = useToast();
  const supervisors = useStudentSupervisors();
  const [lecturerId, setLecturerId] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [discussionTopic, setDiscussionTopic] = useState("");
  const [studentNotes, setStudentNotes] = useState("");
  const start = formatDateInput(new Date());
  const end = formatDateInput(addDays(new Date(), 21));
  const slots = useSupervisorSlots(lecturerId, start, end);
  const createBooking = useCreateBooking();

  useEffect(() => {
    if (!lecturerId && supervisors.data?.[0]) setLecturerId(supervisors.data[0].lecturerId);
  }, [lecturerId, supervisors.data]);

  useEffect(() => {
    setSelectedSlotId("");
  }, [lecturerId]);

  const availableSlots = useMemo(() => slots.data?.filter((slot) => slot.status === "AVAILABLE") ?? [], [slots.data]);
  const selectedSlot = availableSlots.find((slot) => slot.id === selectedSlotId);

  const slotsByDate = useMemo(() => {
    const groups = new Map<string, typeof availableSlots>();
    for (const slot of availableSlots) {
      const list = groups.get(slot.date) ?? [];
      list.push(slot);
      groups.set(slot.date, list);
    }
    return Array.from(groups.entries());
  }, [availableSlots]);

  const submit = async () => {
    if (!selectedSlot) {
      notify({ title: "Select a slot", description: "Choose an available supervision slot before submitting.", variant: "destructive" });
      return;
    }
    try {
      await createBooking.mutateAsync({
        lecturerId: selectedSlot.lecturerId,
        availabilityWindowId: selectedSlot.availabilityWindowId,
        startAt: selectedSlot.startAt,
        endAt: selectedSlot.endAt,
        discussionTopic: discussionTopic || undefined,
        studentNotes: studentNotes || undefined
      });
      setDiscussionTopic("");
      setStudentNotes("");
      setSelectedSlotId("");
      notify({ title: "Request submitted", description: "Your supervisor has been notified.", variant: "success" });
    } catch (error) {
      notify({ title: "Request failed", description: getErrorMessage(error), variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Supervision</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-4">
          <Field label="Supervisor" htmlFor="supervisor">
            {supervisors.isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : supervisors.isError ? (
              <p className="text-sm text-destructive">{getErrorMessage(supervisors.error)}</p>
            ) : supervisors.data && supervisors.data.length === 0 ? (
              <p className="text-sm text-muted-foreground">No assigned supervisors yet.</p>
            ) : (
              <Select id="supervisor" value={lecturerId} onChange={(event) => setLecturerId(event.target.value)}>
                {supervisors.data?.map((assignment) => (
                  <option key={assignment.id} value={assignment.lecturerId}>
                    {assignment.lecturer.academicTitle} {assignment.lecturer.fullName}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <div className="space-y-2">
            <p className="text-sm font-semibold tracking-tight text-foreground">Available Slot</p>
            {slots.isLoading ? (
              <div className="grid gap-2">
                <Skeleton className="h-4 w-24" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            ) : slots.isError ? (
              <p className="text-sm text-destructive">{getErrorMessage(slots.error)}</p>
            ) : slotsByDate.length === 0 ? (
              <p className="rounded-lg border border-dashed bg-muted/35 p-4 text-sm text-muted-foreground">
                No available slots in the next 21 days. Try refreshing or check back later.
              </p>
            ) : (
              <div className="grid max-h-64 gap-3 overflow-y-auto pr-1">
                {slotsByDate.map(([date, slotsForDate]) => (
                  <div key={date}>
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{formatDate(date)}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {slotsForDate.map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setSelectedSlotId(slot.id)}
                          aria-pressed={selectedSlotId === slot.id}
                          className={cn(
                            "rounded-lg border px-3 py-1.5 text-sm font-semibold tracking-tight transition-colors duration-150",
                            selectedSlotId === slot.id
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background hover:bg-muted"
                          )}
                        >
                          {slot.startTime}-{slot.endTime}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="button" onClick={() => void slots.refetch()} variant="outline" disabled={!lecturerId || slots.isFetching}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Refresh Slots
          </Button>
        </div>
        <div className="grid gap-4">
          <Field label="Discussion Topic" htmlFor="discussionTopic">
            <Input
              id="discussionTopic"
              value={discussionTopic}
              maxLength={180}
              onChange={(event) => setDiscussionTopic(event.target.value)}
            />
          </Field>
          <Field label="Student Notes" htmlFor="studentNotes">
            <Textarea id="studentNotes" value={studentNotes} maxLength={1000} onChange={(event) => setStudentNotes(event.target.value)} />
          </Field>
          <Button type="button" onClick={() => void submit()} disabled={createBooking.isPending || !selectedSlot}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Submit Request
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function BookingRow({
  booking,
  viewerRole,
  onCancel,
  onComplete,
  busy
}: {
  booking: Booking;
  viewerRole: "STUDENT" | "LECTURER";
  onCancel: () => void;
  onComplete?: () => void;
  busy: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="font-semibold tracking-tight">{bookingTitle(booking, viewerRole)}</p>
        <p className="mt-1 text-sm text-muted-foreground">{formatDateTime(booking.startAt)}</p>
        <div className="mt-2">
          <StatusBadge status={booking.status} />
        </div>
      </div>
      {booking.status === "APPROVED" ? (
        <div className="flex gap-2">
          {onComplete ? (
            <Button type="button" size="sm" onClick={onComplete} disabled={busy}>
              <Check className="h-4 w-4" aria-hidden="true" />
              Complete
            </Button>
          ) : null}
          <Button type="button" size="sm" variant="outline" onClick={onCancel} disabled={busy}>
            <X className="h-4 w-4" aria-hidden="true" />
            Cancel
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function RequestRow({
  request,
  viewerRole,
  onApprove,
  onReject,
  onCancel,
  busy
}: {
  request: BookingRequest;
  viewerRole: "STUDENT" | "LECTURER";
  onApprove?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
  busy: boolean;
}) {
  return (
    <div className={cn("rounded-lg border p-4", request.status === "PENDING" && "border-warning/40 bg-warning/5")}>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-semibold tracking-tight">{requestTitle(request, viewerRole)}</p>
          <p className="mt-1 text-sm text-muted-foreground">{formatDateTime(request.requestedStartAt)}</p>
          {request.discussionTopic ? <p className="mt-2 text-sm">{request.discussionTopic}</p> : null}
        </div>
        <StatusBadge status={request.status} />
      </div>
      {onApprove || onReject || onCancel ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {onApprove ? (
            <Button type="button" size="sm" onClick={onApprove} disabled={busy}>
              <Check className="h-4 w-4" aria-hidden="true" />
              Approve
            </Button>
          ) : null}
          {onReject ? (
            <Button type="button" size="sm" variant="outline" onClick={onReject} disabled={busy}>
              <X className="h-4 w-4" aria-hidden="true" />
              Reject
            </Button>
          ) : null}
          {onCancel ? (
            <Button type="button" size="sm" variant="outline" onClick={onCancel} disabled={busy}>
              <X className="h-4 w-4" aria-hidden="true" />
              Cancel
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
