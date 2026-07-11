import type { Booking, Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { auditService } from "../audit/audit.service.js";
import { availabilityService } from "../availability/availability.service.js";
import { calculateEligibility } from "../students/eligibility.service.js";
import { notificationService } from "../notifications/notification.service.js";
import { badRequest, conflict, forbidden, notFound } from "../../utils/errors.js";
import { formatJakartaDate } from "../../utils/date.js";

type CreateBookingInput = {
  lecturerId: string;
  availabilityWindowId: string;
  startAt: string;
  endAt: string;
  discussionTopic?: string;
  studentNotes?: string;
};

type DecisionMeta = {
  actorUserId: string;
  ipAddress?: string | undefined;
  userAgent?: string | undefined;
};

const hasOverlapWhere = (startAt: Date, endAt: Date) => ({
  startAt: { lt: endAt },
  endAt: { gt: startAt }
});

const hasRequestOverlapWhere = (startAt: Date, endAt: Date) => ({
  requestedStartAt: { lt: endAt },
  requestedEndAt: { gt: startAt }
});

const ensureValidRange = (startAt: Date, endAt: Date) => {
  if (!(startAt < endAt)) {
    throw badRequest("INVALID_BOOKING_RANGE", "End time must be later than start time.");
  }
};

const findRequestWithRelations = (id: string) =>
  prisma.bookingRequest.findUnique({
    where: { id },
    include: {
      student: { include: { user: true } },
      lecturer: { include: { user: true } },
      booking: true
    }
  });

export const bookingService = {
  async createRequest(studentUserId: string, input: CreateBookingInput, meta: DecisionMeta) {
    const startAt = new Date(input.startAt);
    const endAt = new Date(input.endAt);
    ensureValidRange(startAt, endAt);

    const student = await prisma.studentProfile.findUnique({
      where: { userId: studentUserId },
      include: {
        user: true,
        supervisors: { where: { isActive: true } }
      }
    });
    if (!student) throw forbidden("Only students can create booking requests.");

    const eligibility = calculateEligibility(student.user, student, student.supervisors);
    if (!eligibility.eligible) {
      throw forbidden(eligibility.reasons[0] || "Student is not academically eligible.");
    }

    const supervisor = student.supervisors.find((item) => item.lecturerId === input.lecturerId);
    if (!supervisor) {
      throw forbidden("Students may only book assigned supervisors.");
    }

    const date = formatJakartaDate(startAt);
    const slots = await availabilityService.generateSlots(input.lecturerId, date, date);
    const selectedSlot = slots.find(
      (slot) =>
        slot.availabilityWindowId === input.availabilityWindowId &&
        slot.startAt === startAt.toISOString() &&
        slot.endAt === endAt.toISOString()
    );
    if (!selectedSlot) {
      throw conflict("BOOKING_SLOT_NOT_FOUND", "Selected slot is no longer available.");
    }
    if (selectedSlot.status !== "AVAILABLE") {
      throw conflict("BOOKING_SLOT_UNAVAILABLE", "Selected slot is no longer available.");
    }

    const requestId = await prisma.$transaction(async (tx) => {
      const duplicate = await tx.bookingRequest.findFirst({
        where: {
          studentId: student.id,
          lecturerId: input.lecturerId,
          requestedStartAt: startAt,
          requestedEndAt: endAt,
          status: "PENDING"
        }
      });
      if (duplicate) {
        throw conflict("DUPLICATE_BOOKING_REQUEST", "A pending request already exists for this slot.");
      }

      const [studentPendingConflict, lecturerPendingConflict, studentBookingConflict, lecturerBookingConflict] =
        await Promise.all([
          tx.bookingRequest.findFirst({
            where: { studentId: student.id, status: "PENDING", ...hasRequestOverlapWhere(startAt, endAt) }
          }),
          tx.bookingRequest.findFirst({
            where: { lecturerId: input.lecturerId, status: "PENDING", ...hasRequestOverlapWhere(startAt, endAt) }
          }),
          tx.booking.findFirst({ where: { studentId: student.id, status: "APPROVED", ...hasOverlapWhere(startAt, endAt) } }),
          tx.booking.findFirst({
            where: { lecturerId: input.lecturerId, status: "APPROVED", ...hasOverlapWhere(startAt, endAt) }
          })
        ]);

      if (studentPendingConflict || studentBookingConflict) {
        throw conflict("STUDENT_SCHEDULE_CONFLICT", "Student already has supervision at the selected time.");
      }
      if (lecturerPendingConflict || lecturerBookingConflict) {
        throw conflict("LECTURER_SCHEDULE_CONFLICT", "Lecturer already has a booking request at the selected time.");
      }

      const created = await tx.bookingRequest.create({
        data: {
          studentId: student.id,
          lecturerId: input.lecturerId,
          availabilityWindowId: input.availabilityWindowId,
          requestedStartAt: startAt,
          requestedEndAt: endAt,
          status: "PENDING",
          discussionTopic: input.discussionTopic ?? null,
          studentNotes: input.studentNotes ?? null,
          expiresAt: startAt
        },
        include: {
          student: { include: { user: true } },
          lecturer: { include: { user: true } }
        }
      });

      await auditService.record(
        {
          actorUserId: meta.actorUserId,
          action: "BOOKING_REQUEST_CREATED",
          entityType: "booking_requests",
          entityId: created.id,
          newValues: created as unknown as Prisma.InputJsonValue,
          ipAddress: meta.ipAddress,
          userAgent: meta.userAgent
        },
        tx
      );

      return created.id;
    });

    const request = await findRequestWithRelations(requestId);
    if (!request) throw notFound("Booking request not found.");

    await notificationService.create({
      recipientUserId: request.lecturer.userId,
      type: "BOOKING_CREATED",
      title: "New supervision request",
      message: `${request.student.fullName} requested supervision on ${formatJakartaDate(request.requestedStartAt)}.`,
      entityType: "booking_requests",
      entityId: request.id
    });

    return request;
  },

  async approve(requestId: string, lecturerUserId: string, meta: DecisionMeta) {
    const lecturer = await prisma.lecturerProfile.findUnique({ where: { userId: lecturerUserId } });
    if (!lecturer) throw forbidden("Only lecturers can approve booking requests.");

    const request = await findRequestWithRelations(requestId);
    if (!request) throw notFound("Booking request not found.");
    if (request.lecturerId !== lecturer.id) throw forbidden();
    if (request.status !== "PENDING") {
      throw badRequest("BOOKING_REQUEST_NOT_PENDING", "Only pending booking requests can be approved.");
    }
    if (request.expiresAt && request.expiresAt <= new Date()) {
      await prisma.bookingRequest.update({ where: { id: request.id }, data: { status: "EXPIRED" } });
      throw conflict("BOOKING_REQUEST_EXPIRED", "Booking request has expired.");
    }

    const booking = await prisma.$transaction(async (tx) => {
      const [studentConflict, lecturerConflict] = await Promise.all([
        tx.booking.findFirst({
          where: {
            studentId: request.studentId,
            status: "APPROVED",
            startAt: { lt: request.requestedEndAt },
            endAt: { gt: request.requestedStartAt }
          }
        }),
        tx.booking.findFirst({
          where: {
            lecturerId: request.lecturerId,
            status: "APPROVED",
            startAt: { lt: request.requestedEndAt },
            endAt: { gt: request.requestedStartAt }
          }
        })
      ]);
      if (studentConflict) throw conflict("STUDENT_SCHEDULE_CONFLICT", "Student already has a confirmed booking.");
      if (lecturerConflict) throw conflict("LECTURER_SCHEDULE_CONFLICT", "Lecturer already has a confirmed booking.");

      await tx.bookingRequest.update({
        where: { id: request.id },
        data: {
          status: "APPROVED",
          decidedAt: new Date(),
          decidedByUserId: lecturerUserId
        }
      });

      const created = await tx.booking.create({
        data: {
          bookingRequestId: request.id,
          studentId: request.studentId,
          lecturerId: request.lecturerId,
          startAt: request.requestedStartAt,
          endAt: request.requestedEndAt,
          status: "APPROVED",
          approvedByUserId: lecturerUserId,
          workspace: {
            create: {
              studentId: request.studentId,
              lecturerId: request.lecturerId,
              status: "OPEN"
            }
          }
        },
        include: {
          student: { include: { user: true } },
          lecturer: { include: { user: true } },
          workspace: true,
          bookingRequest: true
        }
      });

      await auditService.record(
        {
          actorUserId: meta.actorUserId,
          action: "BOOKING_APPROVED",
          entityType: "bookings",
          entityId: created.id,
          newValues: created as unknown as Prisma.InputJsonValue,
          ipAddress: meta.ipAddress,
          userAgent: meta.userAgent
        },
        tx
      );
      return created;
    });

    await notificationService.create({
      recipientUserId: booking.student.userId,
      type: "BOOKING_APPROVED",
      title: "Supervision approved",
      message: `Your supervision with ${booking.lecturer.fullName} has been approved.`,
      entityType: "bookings",
      entityId: booking.id
    });

    return booking;
  },

  async reject(requestId: string, lecturerUserId: string, reason: string | undefined, meta: DecisionMeta) {
    const lecturer = await prisma.lecturerProfile.findUnique({ where: { userId: lecturerUserId } });
    if (!lecturer) throw forbidden("Only lecturers can reject booking requests.");

    const request = await findRequestWithRelations(requestId);
    if (!request) throw notFound("Booking request not found.");
    if (request.lecturerId !== lecturer.id) throw forbidden();
    if (request.status !== "PENDING") {
      throw badRequest("BOOKING_REQUEST_NOT_PENDING", "Only pending booking requests can be rejected.");
    }

    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.bookingRequest.update({
        where: { id: request.id },
        data: {
          status: "REJECTED",
          rejectionReason: reason ?? null,
          decidedAt: new Date(),
          decidedByUserId: lecturerUserId
        },
        include: {
          student: { include: { user: true } },
          lecturer: true
        }
      });
      await auditService.record(
        {
          actorUserId: meta.actorUserId,
          action: "BOOKING_REJECTED",
          entityType: "booking_requests",
          entityId: result.id,
          oldValues: request as unknown as Prisma.InputJsonValue,
          newValues: result as unknown as Prisma.InputJsonValue,
          ipAddress: meta.ipAddress,
          userAgent: meta.userAgent
        },
        tx
      );
      return result;
    });

    await notificationService.create({
      recipientUserId: updated.student.userId,
      type: "BOOKING_REJECTED",
      title: "Supervision request rejected",
      message: reason || "Your supervision request was rejected.",
      entityType: "booking_requests",
      entityId: updated.id
    });
    return updated;
  },

  async cancel(id: string, user: Express.AuthUser, reason: string | undefined, meta: DecisionMeta) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        student: { include: { user: true } },
        lecturer: { include: { user: true } }
      }
    });

    if (booking) {
      const isStudentOwner = user.role === "STUDENT" && user.studentProfileId === booking.studentId;
      const isLecturerOwner = user.role === "LECTURER" && user.lecturerProfileId === booking.lecturerId;
      if (!isStudentOwner && !isLecturerOwner) throw forbidden();
      if (isStudentOwner && booking.startAt <= new Date()) {
        throw forbidden("Students may cancel only before the session starts.");
      }
      if (booking.status !== "APPROVED") throw badRequest("BOOKING_NOT_APPROVED", "Only approved bookings can be cancelled.");

      const updated = await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: "CANCELLED",
          cancelledAt: new Date(),
          cancelledByUserId: user.id,
          cancellationReason: reason ?? null
        },
        include: {
          student: { include: { user: true } },
          lecturer: { include: { user: true } }
        }
      });

      await auditService.record({
        actorUserId: meta.actorUserId,
        action: "BOOKING_CANCELLED",
        entityType: "bookings",
        entityId: updated.id,
        oldValues: booking as unknown as Prisma.InputJsonValue,
        newValues: updated as unknown as Prisma.InputJsonValue,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent
      });

      const recipient = isStudentOwner ? updated.lecturer.userId : updated.student.userId;
      await notificationService.create({
        recipientUserId: recipient,
        type: "BOOKING_CANCELLED",
        title: "Supervision cancelled",
        message: reason || "A confirmed supervision session was cancelled.",
        entityType: "bookings",
        entityId: updated.id
      });
      return updated;
    }

    const request = await findRequestWithRelations(id);
    if (!request) throw notFound("Booking not found.");
    if (user.role !== "STUDENT" || user.studentProfileId !== request.studentId) throw forbidden();
    if (request.status !== "PENDING") throw badRequest("BOOKING_REQUEST_NOT_PENDING", "Only pending requests can be cancelled.");

    return prisma.bookingRequest.update({
      where: { id: request.id },
      data: { status: "CANCELLED", cancelledAt: new Date() }
    });
  },

  async complete(bookingId: string, lecturerUserId: string, meta: DecisionMeta) {
    const lecturer = await prisma.lecturerProfile.findUnique({ where: { userId: lecturerUserId } });
    if (!lecturer) throw forbidden();
    const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { workspace: true } });
    if (!booking) throw notFound("Booking not found.");
    if (booking.lecturerId !== lecturer.id) throw forbidden();
    if (booking.status !== "APPROVED") throw badRequest("BOOKING_NOT_APPROVED", "Only approved bookings can be completed.");

    return prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id: booking.id },
        data: { status: "COMPLETED", completedAt: new Date() },
        include: { workspace: true }
      });
      if (booking.workspace) {
        await tx.sessionWorkspace.update({
          where: { id: booking.workspace.id },
          data: { status: "COMPLETED", completedAt: new Date() }
        });
      }
      await auditService.record(
        {
          actorUserId: meta.actorUserId,
          action: "BOOKING_COMPLETED",
          entityType: "bookings",
          entityId: updated.id
        },
        tx
      );
      return updated;
    });
  },

  async list(user: Express.AuthUser, page = 1, pageSize = 20, status?: string) {
    const skip = (page - 1) * pageSize;
    if (
      (user.role === "STUDENT" && !user.studentProfileId) ||
      (user.role === "LECTURER" && !user.lecturerProfileId)
    ) {
      throw notFound("Profile not found.");
    }
    const profileId = user.role === "STUDENT" ? user.studentProfileId : user.lecturerProfileId;
    if (!profileId) throw notFound("Profile not found.");
    const where: Prisma.BookingWhereInput =
      user.role === "STUDENT"
        ? { studentId: profileId, ...(status ? { status: status as Booking["status"] } : {}) }
        : { lecturerId: profileId, ...(status ? { status: status as Booking["status"] } : {}) };
    const requestWhere: Prisma.BookingRequestWhereInput =
      user.role === "STUDENT" ? { studentId: profileId } : { lecturerId: profileId };

    const [bookings, requests, totalBookings] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { startAt: "desc" },
        skip,
        take: pageSize,
        include: {
          student: true,
          lecturer: true,
          bookingRequest: true,
          workspace: true
        }
      }),
      prisma.bookingRequest.findMany({
        where: requestWhere,
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { student: true, lecturer: true }
      }),
      prisma.booking.count({ where })
    ]);
    return { bookings, recentRequests: requests, pagination: { page, pageSize, total: totalBookings } };
  },

  async get(id: string, user: Express.AuthUser) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        student: true,
        lecturer: true,
        bookingRequest: true,
        workspace: { include: { notes: true, feedback: true, revisions: { include: { attachments: true } } } }
      }
    });
    if (!booking) throw notFound("Booking not found.");
    const allowed =
      (user.role === "STUDENT" && user.studentProfileId === booking.studentId) ||
      (user.role === "LECTURER" && user.lecturerProfileId === booking.lecturerId);
    if (!allowed) throw forbidden();
    return booking;
  }
};
