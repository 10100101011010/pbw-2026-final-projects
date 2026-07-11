import { apiRequest } from "./api";
import type { AvailabilityException, AvailabilityWindow, BookableSlot } from "./types";

export type AvailabilityWindowInput = {
  windowType: "RECURRING" | "ONE_TIME";
  dayOfWeek?: number;
  specificDate?: string;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  recurrenceStartDate?: string;
  recurrenceEndDate?: string | null;
};

export type AvailabilityExceptionInput = {
  exceptionDate: string;
  exceptionType: "CANCELLED" | "MODIFIED";
  overrideStartTime?: string;
  overrideEndTime?: string;
  overrideSlotDurationMinutes?: number;
  reason?: string;
};

export const availabilityService = {
  lecturerWindows: () => apiRequest<AvailabilityWindow[]>("/lecturer/availability"),
  lecturerSlots: (start: string, end: string) =>
    apiRequest<BookableSlot[]>(`/lecturer/availability/slots?start=${start}&end=${end}`),
  createWindow: (input: AvailabilityWindowInput) =>
    apiRequest<AvailabilityWindow>("/lecturer/availability", { method: "POST", body: input }),
  updateWindow: (id: string, input: AvailabilityWindowInput) =>
    apiRequest<AvailabilityWindow>(`/lecturer/availability/${id}`, { method: "PUT", body: input }),
  deleteWindow: (id: string) =>
    apiRequest<AvailabilityWindow>(`/lecturer/availability/${id}`, { method: "DELETE" }),
  createException: (windowId: string, input: AvailabilityExceptionInput) =>
    apiRequest<AvailabilityException>(`/lecturer/availability/${windowId}/exceptions`, {
      method: "POST",
      body: input
    }),
  studentSupervisors: () => apiRequest<import("./types").SupervisorAssignment[]>("/student/supervisors"),
  supervisorSlots: (lecturerId: string, start: string, end: string) =>
    apiRequest<BookableSlot[]>(`/student/supervisors/${lecturerId}/availability?start=${start}&end=${end}`)
};
