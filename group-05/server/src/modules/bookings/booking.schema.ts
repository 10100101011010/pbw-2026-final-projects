import { z } from "zod";

export const createBookingSchema = z.object({
  lecturerId: z.string().uuid(),
  availabilityWindowId: z.string().uuid(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  discussionTopic: z.string().max(180).optional(),
  studentNotes: z.string().max(1000).optional()
});

export const rejectBookingSchema = z.object({
  reason: z.string().max(240).optional()
});

export const cancelBookingSchema = z.object({
  reason: z.string().max(240).optional()
});

export const listBookingQuerySchema = z.object({
  status: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(50).default(20)
});
