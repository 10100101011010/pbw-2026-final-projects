import { z } from "zod";

export const noteSchema = z.object({
  title: z.string().min(3).max(120),
  notes: z.string().min(3).max(8000)
});

export const feedbackSchema = z.object({
  feedback: z.string().min(3).max(8000),
  visibility: z.enum(["STUDENT_VISIBLE", "PRIVATE"]).default("STUDENT_VISIBLE")
});

export const revisionSchema = z.object({
  title: z.string().min(3).max(160),
  description: z.string().max(2000).optional()
});
