import { z } from "zod";

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:mm time format.");

export const availabilityWindowSchema = z
  .object({
    windowType: z.enum(["RECURRING", "ONE_TIME"]),
    dayOfWeek: z.number().int().min(0).max(6).optional(),
    specificDate: z.string().date().optional(),
    startTime: timeSchema,
    endTime: timeSchema,
    slotDurationMinutes: z.number().int().min(15).max(120),
    recurrenceStartDate: z.string().date().optional(),
    recurrenceEndDate: z.string().date().optional().nullable()
  })
  .superRefine((value, ctx) => {
    if (value.endTime <= value.startTime) {
      ctx.addIssue({ code: "custom", path: ["endTime"], message: "End time must be later than start time." });
    }
    if (value.windowType === "RECURRING" && (value.dayOfWeek === undefined || !value.recurrenceStartDate)) {
      ctx.addIssue({ code: "custom", path: ["dayOfWeek"], message: "Recurring availability requires day and start date." });
    }
    if (value.windowType === "ONE_TIME" && !value.specificDate) {
      ctx.addIssue({ code: "custom", path: ["specificDate"], message: "One-time availability requires a date." });
    }
    if (value.recurrenceEndDate && value.recurrenceStartDate && value.recurrenceEndDate < value.recurrenceStartDate) {
      ctx.addIssue({ code: "custom", path: ["recurrenceEndDate"], message: "Recurrence end cannot be before start." });
    }
  });

export const availabilityExceptionSchema = z
  .object({
    exceptionDate: z.string().date(),
    exceptionType: z.enum(["CANCELLED", "MODIFIED"]),
    overrideStartTime: timeSchema.optional(),
    overrideEndTime: timeSchema.optional(),
    overrideSlotDurationMinutes: z.number().int().min(15).max(120).optional(),
    reason: z.string().max(240).optional()
  })
  .superRefine((value, ctx) => {
    if (value.exceptionType === "MODIFIED") {
      if (!value.overrideStartTime || !value.overrideEndTime || !value.overrideSlotDurationMinutes) {
        ctx.addIssue({ code: "custom", message: "Modified exceptions require override time range and duration." });
      }
      if (value.overrideStartTime && value.overrideEndTime && value.overrideEndTime <= value.overrideStartTime) {
        ctx.addIssue({ code: "custom", path: ["overrideEndTime"], message: "End time must be later than start time." });
      }
    }
  });

export const calendarQuerySchema = z.object({
  start: z.string().date().optional(),
  end: z.string().date().optional()
});
