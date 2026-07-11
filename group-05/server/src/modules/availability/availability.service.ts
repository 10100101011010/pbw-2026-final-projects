import type { AvailabilityWindow, Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import {
  addDaysToDateString,
  dateStringDayOfWeek,
  enumerateDates,
  formatJakartaDate,
  jakartaDateTimeToUtc,
  minutesFromTime,
  normalizeDateInput,
  rangesOverlap,
  timeFromMinutes
} from "../../utils/date.js";
import { badRequest, forbidden, notFound } from "../../utils/errors.js";
import { auditService } from "../audit/audit.service.js";

export type BookableSlotStatus = "AVAILABLE" | "PENDING" | "BOOKED";

export type BookableSlot = {
  id: string;
  availabilityWindowId: string;
  lecturerId: string;
  startAt: string;
  endAt: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookableSlotStatus;
};

type WindowInput = {
  windowType: "RECURRING" | "ONE_TIME";
  dayOfWeek?: number;
  specificDate?: string;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  recurrenceStartDate?: string;
  recurrenceEndDate?: string | null;
};

type ExceptionInput = {
  exceptionDate: string;
  exceptionType: "CANCELLED" | "MODIFIED";
  overrideStartTime?: string;
  overrideEndTime?: string;
  overrideSlotDurationMinutes?: number;
  reason?: string;
};

const toDateValue = (value?: string | null) => (value ? jakartaDateTimeToUtc(value, "00:00") : null);

const windowAppliesToDate = (window: AvailabilityWindow, date: string) => {
  if (window.windowType === "ONE_TIME") {
    return window.specificDate ? normalizeDateInput(window.specificDate) === date : false;
  }
  if (window.dayOfWeek !== dateStringDayOfWeek(date)) return false;
  if (window.recurrenceStartDate && date < normalizeDateInput(window.recurrenceStartDate)) return false;
  if (window.recurrenceEndDate && date > normalizeDateInput(window.recurrenceEndDate)) return false;
  return true;
};

const splitWindowIntoSlots = (
  window: AvailabilityWindow,
  date: string,
  startTime: string,
  endTime: string,
  duration: number
): BookableSlot[] => {
  const slots: BookableSlot[] = [];
  for (let start = minutesFromTime(startTime); start + duration <= minutesFromTime(endTime); start += duration) {
    const slotStart = timeFromMinutes(start);
    const slotEnd = timeFromMinutes(start + duration);
    const startAt = jakartaDateTimeToUtc(date, slotStart);
    const endAt = jakartaDateTimeToUtc(date, slotEnd);
    slots.push({
      id: `${window.id}:${startAt.toISOString()}`,
      availabilityWindowId: window.id,
      lecturerId: window.lecturerId,
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
      date,
      startTime: slotStart,
      endTime: slotEnd,
      status: "AVAILABLE"
    });
  }
  return slots;
};

export const availabilityService = {
  async listWindows(lecturerId: string) {
    return prisma.availabilityWindow.findMany({
      where: { lecturerId, deletedAt: null },
      orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
      include: { exceptions: { orderBy: { exceptionDate: "asc" } } }
    });
  },

  async createWindow(lecturerId: string, input: WindowInput, actorUserId: string) {
    const window = await prisma.availabilityWindow.create({
      data: {
        lecturerId,
        windowType: input.windowType,
        dayOfWeek: input.windowType === "RECURRING" ? input.dayOfWeek ?? null : null,
        specificDate: input.windowType === "ONE_TIME" ? toDateValue(input.specificDate) : null,
        startTime: input.startTime,
        endTime: input.endTime,
        slotDurationMinutes: input.slotDurationMinutes,
        recurrenceStartDate: input.windowType === "RECURRING" ? toDateValue(input.recurrenceStartDate) : null,
        recurrenceEndDate: input.windowType === "RECURRING" ? toDateValue(input.recurrenceEndDate) : null
      }
    });
    await auditService.record({
      actorUserId,
      action: "AVAILABILITY_CREATED",
      entityType: "availability_windows",
      entityId: window.id,
      newValues: window as unknown as Prisma.InputJsonValue
    });
    return window;
  },

  async updateWindow(lecturerId: string, id: string, input: WindowInput, actorUserId: string) {
    const current = await prisma.availabilityWindow.findUnique({ where: { id } });
    if (!current || current.deletedAt) throw notFound("Availability window not found.");
    if (current.lecturerId !== lecturerId) throw forbidden();

    const window = await prisma.availabilityWindow.update({
      where: { id },
      data: {
        windowType: input.windowType,
        dayOfWeek: input.windowType === "RECURRING" ? input.dayOfWeek ?? null : null,
        specificDate: input.windowType === "ONE_TIME" ? toDateValue(input.specificDate) : null,
        startTime: input.startTime,
        endTime: input.endTime,
        slotDurationMinutes: input.slotDurationMinutes,
        recurrenceStartDate: input.windowType === "RECURRING" ? toDateValue(input.recurrenceStartDate) : null,
        recurrenceEndDate: input.windowType === "RECURRING" ? toDateValue(input.recurrenceEndDate) : null
      }
    });
    await auditService.record({
      actorUserId,
      action: "AVAILABILITY_UPDATED",
      entityType: "availability_windows",
      entityId: window.id,
      oldValues: current as unknown as Prisma.InputJsonValue,
      newValues: window as unknown as Prisma.InputJsonValue
    });
    return window;
  },

  async deleteWindow(lecturerId: string, id: string, actorUserId: string) {
    const current = await prisma.availabilityWindow.findUnique({ where: { id } });
    if (!current || current.deletedAt) throw notFound("Availability window not found.");
    if (current.lecturerId !== lecturerId) throw forbidden();
    const window = await prisma.availabilityWindow.update({
      where: { id },
      data: { isActive: false, deletedAt: new Date() }
    });
    await auditService.record({
      actorUserId,
      action: "AVAILABILITY_DELETED",
      entityType: "availability_windows",
      entityId: id,
      oldValues: current as unknown as Prisma.InputJsonValue
    });
    return window;
  },

  async createException(lecturerId: string, windowId: string, input: ExceptionInput, actorUserId: string) {
    const window = await prisma.availabilityWindow.findUnique({ where: { id: windowId } });
    if (!window || window.deletedAt) throw notFound("Availability window not found.");
    if (window.lecturerId !== lecturerId) throw forbidden();
    if (window.windowType !== "RECURRING") {
      throw badRequest("EXCEPTION_REQUIRES_RECURRING_WINDOW", "Exceptions can only be created for recurring availability.");
    }

    const exception = await prisma.availabilityException.upsert({
      where: { availabilityWindowId_exceptionDate: { availabilityWindowId: windowId, exceptionDate: toDateValue(input.exceptionDate)! } },
      create: {
        availabilityWindowId: windowId,
        lecturerId,
        exceptionDate: toDateValue(input.exceptionDate)!,
        exceptionType: input.exceptionType,
        overrideStartTime: input.overrideStartTime ?? null,
        overrideEndTime: input.overrideEndTime ?? null,
        overrideSlotDurationMinutes: input.overrideSlotDurationMinutes ?? null,
        reason: input.reason ?? null
      },
      update: {
        exceptionType: input.exceptionType,
        overrideStartTime: input.overrideStartTime ?? null,
        overrideEndTime: input.overrideEndTime ?? null,
        overrideSlotDurationMinutes: input.overrideSlotDurationMinutes ?? null,
        reason: input.reason ?? null
      }
    });
    await auditService.record({
      actorUserId,
      action: "AVAILABILITY_EXCEPTION_CREATED",
      entityType: "availability_exceptions",
      entityId: exception.id,
      newValues: exception as unknown as Prisma.InputJsonValue
    });
    return exception;
  },

  async generateSlots(lecturerId: string, startDateInput: string, endDateInput: string): Promise<BookableSlot[]> {
    const startDate = startDateInput.slice(0, 10);
    const endDate = endDateInput.slice(0, 10);
    const dates = enumerateDates(startDate, endDate);
    const rangeStart = jakartaDateTimeToUtc(startDate, "00:00");
    const rangeEnd = jakartaDateTimeToUtc(addDaysToDateString(endDate, 1), "00:00");

    const [windows, exceptions, pendingRequests, bookings] = await Promise.all([
      prisma.availabilityWindow.findMany({
        where: { lecturerId, isActive: true, deletedAt: null }
      }),
      prisma.availabilityException.findMany({
        where: {
          lecturerId,
          exceptionDate: { gte: toDateValue(startDate)!, lte: toDateValue(endDate)! }
        }
      }),
      prisma.bookingRequest.findMany({
        where: {
          lecturerId,
          status: "PENDING",
          requestedStartAt: { lt: rangeEnd },
          requestedEndAt: { gt: rangeStart }
        }
      }),
      prisma.booking.findMany({
        where: {
          lecturerId,
          status: "APPROVED",
          startAt: { lt: rangeEnd },
          endAt: { gt: rangeStart }
        }
      })
    ]);

    const slots = windows.flatMap((window) =>
      dates.flatMap((date) => {
        if (!windowAppliesToDate(window, date)) return [];
        const exception = exceptions.find(
          (item) => item.availabilityWindowId === window.id && formatJakartaDate(item.exceptionDate) === date
        );
        if (exception?.exceptionType === "CANCELLED") return [];
        const startTime = exception?.overrideStartTime ?? window.startTime;
        const endTime = exception?.overrideEndTime ?? window.endTime;
        const duration = exception?.overrideSlotDurationMinutes ?? window.slotDurationMinutes;
        return splitWindowIntoSlots(window, date, startTime, endTime, duration);
      })
    );

    return slots.map((slot) => {
      const start = new Date(slot.startAt);
      const end = new Date(slot.endAt);
      const hasPending = pendingRequests.some((request) =>
        rangesOverlap(start, end, request.requestedStartAt, request.requestedEndAt)
      );
      const hasBooking = bookings.some((booking) => rangesOverlap(start, end, booking.startAt, booking.endAt));
      return {
        ...slot,
        status: hasBooking ? "BOOKED" : hasPending ? "PENDING" : "AVAILABLE"
      };
    });
  }
};
