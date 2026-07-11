import { apiRequest } from "./api";
import type { Booking, BookingListResponse, BookingRequest } from "./types";

export type CreateBookingInput = {
  lecturerId: string;
  availabilityWindowId: string;
  startAt: string;
  endAt: string;
  discussionTopic?: string;
  studentNotes?: string;
};

export const bookingService = {
  list: (page = 1, pageSize = 20, status?: string) => {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (status) params.set("status", status);
    return apiRequest<BookingListResponse>(`/bookings?${params.toString()}`);
  },
  create: (input: CreateBookingInput) =>
    apiRequest<BookingRequest>("/bookings", {
      method: "POST",
      body: input
    }),
  approve: (id: string) => apiRequest<Booking>(`/bookings/${id}/approve`, { method: "PATCH", body: {} }),
  reject: (id: string, reason?: string) =>
    apiRequest<BookingRequest>(`/bookings/${id}/reject`, {
      method: "PATCH",
      body: { reason }
    }),
  cancel: (id: string, reason?: string) =>
    apiRequest<Booking | BookingRequest>(`/bookings/${id}/cancel`, {
      method: "PATCH",
      body: { reason }
    }),
  complete: (id: string) => apiRequest<Booking>(`/bookings/${id}/complete`, { method: "PATCH", body: {} })
};
