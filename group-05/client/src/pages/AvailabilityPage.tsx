import type { EventClickArg, EventInput } from "@fullcalendar/core";
import { CalendarClock, CalendarPlus, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { EmptyState } from "../components/ui/empty-state";
import { Field, Input, Select } from "../components/ui/input";
import { PageGrid, PageHeader } from "../components/ui/page";
import { StatusBadge } from "../components/ui/status-badge";
import { useToast } from "../components/ui/toast-context";
import { useAuth } from "../features/auth/auth-context";
import {
  useCreateAvailabilityException,
  useCreateAvailabilityWindow,
  useDeleteAvailabilityWindow,
  useLecturerAvailabilityWindows,
  useLecturerSlots,
  useStudentSupervisors,
  useSupervisorSlots
} from "../features/availability/queries";
import { useCreateBooking } from "../features/bookings/queries";
import { addDays, cn, formatDate, formatDateInput, getErrorMessage } from "../lib/utils";
import type { BookableSlot } from "../services/types";
import { slotLabel } from "./page-helpers";

const today = formatDateInput(new Date());
const initialRange = { start: today, end: formatDateInput(addDays(new Date(), 30)) };
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function AvailabilityPage() {
  const { role } = useAuth();

  if (role === "LECTURER") return <LecturerAvailability />;
  if (role === "STUDENT") return <StudentAvailability />;
  return null;
}

function CalendarLegend() {
  const items: { label: string; colorClass: string }[] = [
    { label: "Available", colorClass: "bg-success" },
    { label: "Pending", colorClass: "bg-warning" },
    { label: "Booked", colorClass: "bg-destructive" }
  ];
  return (
    <div className="mb-3 flex flex-wrap items-center gap-4 text-xs font-semibold text-muted-foreground">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1.5">
          <span className={cn("h-2.5 w-2.5 rounded-full", item.colorClass)} aria-hidden="true" />
          {item.label}
        </span>
      ))}
    </div>
  );
}

function StudentAvailability() {
  const { notify } = useToast();
  const supervisors = useStudentSupervisors();
  const [lecturerId, setLecturerId] = useState("");
  const [range, setRange] = useState(initialRange);
  const [selectedSlot, setSelectedSlot] = useState<BookableSlot | null>(null);
  const slots = useSupervisorSlots(lecturerId, range.start, range.end);
  const createBooking = useCreateBooking();

  useEffect(() => {
    if (!lecturerId && supervisors.data?.[0]) setLecturerId(supervisors.data[0].lecturerId);
  }, [lecturerId, supervisors.data]);

  const events = useMemo<EventInput[]>(() => (slots.data ?? []).map(slotToEvent), [slots.data]);

  const requestSlot = async () => {
    if (!selectedSlot) return;
    try {
      await createBooking.mutateAsync({
        lecturerId: selectedSlot.lecturerId,
        availabilityWindowId: selectedSlot.availabilityWindowId,
        startAt: selectedSlot.startAt,
        endAt: selectedSlot.endAt
      });
      setSelectedSlot(null);
      notify({ title: "Request submitted", description: "Your supervisor has been notified.", variant: "success" });
    } catch (error) {
      notify({ title: "Request failed", description: getErrorMessage(error), variant: "destructive" });
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Availability"
        title="Supervisor Availability"
        description="Generated bookable slots from assigned supervisors."
        actions={
          <Select value={lecturerId} onChange={(event) => setLecturerId(event.target.value)} aria-label="Select supervisor">
            {supervisors.data?.map((assignment) => (
              <option key={assignment.id} value={assignment.lecturerId}>
                {assignment.lecturer.academicTitle} {assignment.lecturer.fullName}
              </option>
            ))}
          </Select>
        }
      />
      <PageGrid className="lg:grid-cols-[1fr_22rem]">
        <div>
          <CalendarLegend />
          {slots.isError ? (
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
              <span>{getErrorMessage(slots.error)}</span>
              <Button type="button" size="sm" variant="outline" onClick={() => void slots.refetch()}>
                Retry
              </Button>
            </div>
          ) : null}
          <Calendar
            events={events}
            onDatesSet={(arg) => setRange({ start: formatDateInput(arg.start), end: formatDateInput(arg.end) })}
            onEventClick={(arg) => {
              const slot = arg.event.extendedProps.slot as BookableSlot | undefined;
              setSelectedSlot(slot?.status === "AVAILABLE" ? slot : null);
            }}
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Selected Slot</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {selectedSlot ? (
              <>
                <div className="rounded-lg border p-4">
                  <p className="font-semibold tracking-tight">{slotLabel(selectedSlot)}</p>
                  <div className="mt-3">
                    <StatusBadge status={selectedSlot.status} />
                  </div>
                </div>
                <Button type="button" onClick={() => void requestSlot()} disabled={createBooking.isPending}>
                  <CalendarClock className="h-4 w-4" aria-hidden="true" />
                  Request Slot
                </Button>
              </>
            ) : (
              <EmptyState title="No slot selected" description="Available calendar slots can be selected for booking requests." />
            )}
          </CardContent>
        </Card>
      </PageGrid>
    </>
  );
}

function LecturerAvailability() {
  const { notify } = useToast();
  const [range, setRange] = useState(initialRange);
  const [windowType, setWindowType] = useState<"RECURRING" | "ONE_TIME">("RECURRING");
  const [exceptionType, setExceptionType] = useState<"CANCELLED" | "MODIFIED">("CANCELLED");
  const slots = useLecturerSlots(range.start, range.end);
  const windows = useLecturerAvailabilityWindows();
  const createWindow = useCreateAvailabilityWindow();
  const deleteWindow = useDeleteAvailabilityWindow();
  const createException = useCreateAvailabilityException();
  const events = useMemo<EventInput[]>(() => (slots.data ?? []).map(slotToEvent), [slots.data]);
  // Exceptions modify a single occurrence of a recurring window (SRS FR-014); a one-time window
  // is already a single occurrence, so it can never be excepted -- only recurring windows qualify.
  const recurringWindows = useMemo(
    () => (windows.data ?? []).filter((window) => window.windowType === "RECURRING"),
    [windows.data]
  );

  const submitWindow = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Capture the form element synchronously: React resets the synthetic event's
    // currentTarget to null once the handler yields at the first await, so reading
    // event.currentTarget after the mutation would throw. The DOM node itself stays valid.
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      await createWindow.mutateAsync({
        windowType,
        dayOfWeek: windowType === "RECURRING" ? Number(form.get("dayOfWeek")) : undefined,
        specificDate: windowType === "ONE_TIME" ? String(form.get("specificDate")) : undefined,
        startTime: String(form.get("startTime")),
        endTime: String(form.get("endTime")),
        slotDurationMinutes: Number(form.get("slotDurationMinutes")),
        recurrenceStartDate: windowType === "RECURRING" ? String(form.get("recurrenceStartDate")) : undefined,
        recurrenceEndDate: form.get("recurrenceEndDate") ? String(form.get("recurrenceEndDate")) : null
      });
      formElement.reset();
      setWindowType("RECURRING");
      notify({ title: "Availability created", variant: "success" });
    } catch (error) {
      notify({ title: "Availability failed", description: getErrorMessage(error), variant: "destructive" });
    }
  };

  const submitException = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const windowId = String(form.get("windowId"));
    try {
      await createException.mutateAsync({
        windowId,
        input: {
          exceptionDate: String(form.get("exceptionDate")),
          exceptionType,
          overrideStartTime: optionalFormValue(form, "overrideStartTime"),
          overrideEndTime: optionalFormValue(form, "overrideEndTime"),
          overrideSlotDurationMinutes: form.get("overrideSlotDurationMinutes") ? Number(form.get("overrideSlotDurationMinutes")) : undefined,
          reason: optionalFormValue(form, "reason")
        }
      });
      formElement.reset();
      setExceptionType("CANCELLED");
      notify({ title: "Exception saved", variant: "success" });
    } catch (error) {
      notify({ title: "Exception failed", description: getErrorMessage(error), variant: "destructive" });
    }
  };

  const removeWindow = async (id: string) => {
    try {
      await deleteWindow.mutateAsync(id);
      notify({ title: "Availability removed", variant: "success" });
    } catch (error) {
      notify({ title: "Delete failed", description: getErrorMessage(error), variant: "destructive" });
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Availability"
        title="Manage Availability"
        description="Recurring and one-time windows generate bookable supervision slots."
        actions={
          <Button type="button" variant="outline" onClick={() => void slots.refetch()} disabled={slots.isFetching}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Refresh Calendar
          </Button>
        }
      />
      <PageGrid className="lg:grid-cols-[1fr_24rem]">
        <div>
          <CalendarLegend />
          {slots.isError ? (
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
              <span>{getErrorMessage(slots.error)}</span>
              <Button type="button" size="sm" variant="outline" onClick={() => void slots.refetch()}>
                Retry
              </Button>
            </div>
          ) : null}
          <Calendar
            events={events}
            onDatesSet={(arg) => setRange({ start: formatDateInput(arg.start), end: formatDateInput(arg.end) })}
            onEventClick={(arg: EventClickArg) => {
              const slot = arg.event.extendedProps.slot as BookableSlot | undefined;
              if (slot) notify({ title: slotLabel(slot), description: `Status: ${slot.status}` });
            }}
          />
        </div>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Window</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-3" onSubmit={(event) => void submitWindow(event)}>
                <Field label="Type" htmlFor="windowType">
                  <Select
                    id="windowType"
                    name="windowType"
                    value={windowType}
                    onChange={(event) => setWindowType(event.target.value as "RECURRING" | "ONE_TIME")}
                  >
                    <option value="RECURRING">Recurring</option>
                    <option value="ONE_TIME">One-time</option>
                  </Select>
                </Field>
                {windowType === "RECURRING" ? (
                  <Field label="Day" htmlFor="dayOfWeek">
                    <Select id="dayOfWeek" name="dayOfWeek" defaultValue="1">
                      <option value="1">Monday</option>
                      <option value="2">Tuesday</option>
                      <option value="3">Wednesday</option>
                      <option value="4">Thursday</option>
                      <option value="5">Friday</option>
                      <option value="6">Saturday</option>
                      <option value="0">Sunday</option>
                    </Select>
                  </Field>
                ) : (
                  <Field label="Date" htmlFor="specificDate">
                    <Input id="specificDate" name="specificDate" type="date" required />
                  </Field>
                )}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Start" htmlFor="startTime">
                    <Input id="startTime" name="startTime" type="time" required defaultValue="09:00" />
                  </Field>
                  <Field label="End" htmlFor="endTime">
                    <Input id="endTime" name="endTime" type="time" required defaultValue="12:00" />
                  </Field>
                </div>
                <Field label="Slot Duration" htmlFor="slotDurationMinutes">
                  <Input id="slotDurationMinutes" name="slotDurationMinutes" type="number" min={15} max={120} required defaultValue={30} />
                </Field>
                {windowType === "RECURRING" ? (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Recurrence Start" htmlFor="recurrenceStartDate">
                      <Input id="recurrenceStartDate" name="recurrenceStartDate" type="date" required defaultValue={today} />
                    </Field>
                    <Field label="Recurrence End" htmlFor="recurrenceEndDate">
                      <Input id="recurrenceEndDate" name="recurrenceEndDate" type="date" />
                    </Field>
                  </div>
                ) : null}
                <Button type="submit" disabled={createWindow.isPending}>
                  <CalendarPlus className="h-4 w-4" aria-hidden="true" />
                  Save Window
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Exception</CardTitle>
            </CardHeader>
            <CardContent>
              {windows.isError ? (
                <p className="text-sm text-destructive">{getErrorMessage(windows.error)}</p>
              ) : recurringWindows.length === 0 ? (
                <p className="rounded-lg border border-dashed bg-muted/35 p-4 text-sm text-muted-foreground">
                  Exceptions apply only to recurring availability. Create a recurring window first, then cancel or modify a
                  specific date.
                </p>
              ) : (
                <form className="grid gap-3" onSubmit={(event) => void submitException(event)}>
                  <Field label="Window" htmlFor="windowId">
                    <Select id="windowId" name="windowId" required>
                      {recurringWindows.map((window) => (
                        <option key={window.id} value={window.id}>
                          {dayNames[window.dayOfWeek ?? 0]} {window.startTime}-{window.endTime}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Exception Date" htmlFor="exceptionDate">
                    <Input id="exceptionDate" name="exceptionDate" type="date" required />
                  </Field>
                  <Field label="Type" htmlFor="exceptionType">
                    <Select
                      id="exceptionType"
                      name="exceptionType"
                      value={exceptionType}
                      onChange={(event) => setExceptionType(event.target.value as "CANCELLED" | "MODIFIED")}
                    >
                      <option value="CANCELLED">Cancelled</option>
                      <option value="MODIFIED">Modified</option>
                    </Select>
                  </Field>
                  {exceptionType === "MODIFIED" ? (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <Field label="Start" htmlFor="overrideStartTime">
                        <Input id="overrideStartTime" name="overrideStartTime" type="time" required />
                      </Field>
                      <Field label="End" htmlFor="overrideEndTime">
                        <Input id="overrideEndTime" name="overrideEndTime" type="time" required />
                      </Field>
                      <Field label="Duration" htmlFor="overrideSlotDurationMinutes">
                        <Input id="overrideSlotDurationMinutes" name="overrideSlotDurationMinutes" type="number" min={15} max={120} required />
                      </Field>
                    </div>
                  ) : null}
                  <Field label="Reason (optional)" htmlFor="reason">
                    <Input id="reason" name="reason" maxLength={240} />
                  </Field>
                  <Button type="submit" disabled={createException.isPending}>
                    Save Exception
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </PageGrid>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Availability Windows</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {windows.isError ? (
            <EmptyState
              title="Availability unavailable"
              description={getErrorMessage(windows.error)}
              actionLabel="Try again"
              onAction={() => void windows.refetch()}
            />
          ) : (
            <>
              {windows.data?.map((window) => (
                <div key={window.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold tracking-tight">{window.windowType === "RECURRING" ? "Recurring Window" : "One-time Window"}</p>
                    <StatusBadge status={window.isActive ? "AVAILABLE" : "INACTIVE"} />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {window.specificDate ? formatDate(window.specificDate) : dayNames[window.dayOfWeek ?? 0]} | {window.startTime}-{window.endTime}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{window.slotDurationMinutes} minute slots</p>
                  <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => void removeWindow(window.id)} disabled={deleteWindow.isPending}>
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Remove
                  </Button>
                </div>
              ))}
              {windows.data && !windows.data.length ? <EmptyState title="No availability windows" description="Create a window to publish bookable supervision slots." /> : null}
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}

function slotToEvent(slot: BookableSlot): EventInput {
  return {
    id: slot.id,
    title: slot.status === "AVAILABLE" ? "Available" : slot.status === "PENDING" ? "Pending" : "Booked",
    start: slot.startAt,
    end: slot.endAt,
    extendedProps: { status: slot.status, slot }
  };
}

function optionalFormValue(form: FormData, key: string) {
  const value = form.get(key);
  return value ? String(value) : undefined;
}
