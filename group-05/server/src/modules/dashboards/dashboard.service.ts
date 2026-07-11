import { prisma } from "../../lib/prisma.js";
import { formatJakartaDate } from "../../utils/date.js";
import { forbidden } from "../../utils/errors.js";
import { calculateEligibility } from "../students/eligibility.service.js";

export const dashboardService = {
  async studentDashboard(userId: string) {
    const student = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        user: true,
        supervisors: {
          where: { isActive: true },
          orderBy: { order: "asc" },
          include: { lecturer: { include: { user: true } } }
        }
      }
    });
    if (!student) throw forbidden("Student profile is required.");

    const [upcomingBookings, pendingRequests, notifications, unreadCount, recentWorkspaces] = await Promise.all([
      prisma.booking.findMany({
        where: { studentId: student.id, status: "APPROVED", startAt: { gte: new Date() } },
        orderBy: { startAt: "asc" },
        take: 5,
        include: { lecturer: true, workspace: true }
      }),
      prisma.bookingRequest.findMany({
        where: { studentId: student.id, status: "PENDING" },
        orderBy: { requestedStartAt: "asc" },
        take: 5,
        include: { lecturer: true }
      }),
      prisma.notification.findMany({
        where: { recipientUserId: userId },
        orderBy: { createdAt: "desc" },
        take: 10
      }),
      prisma.notification.count({ where: { recipientUserId: userId, readAt: null } }),
      prisma.sessionWorkspace.findMany({
        where: { studentId: student.id },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          lecturer: true,
          booking: true,
          revisions: { orderBy: { versionNumber: "desc" }, take: 1 },
          feedback: { orderBy: { createdAt: "desc" }, take: 1 }
        }
      })
    ]);

    return {
      profile: student,
      eligibility: calculateEligibility(student.user, student, student.supervisors),
      supervisors: student.supervisors,
      upcomingBookings,
      pendingRequests,
      recentWorkspaces,
      notifications,
      unreadCount
    };
  },

  async lecturerDashboard(userId: string) {
    const lecturer = await prisma.lecturerProfile.findUnique({ where: { userId }, include: { user: true } });
    if (!lecturer) throw forbidden("Lecturer profile is required.");
    const today = formatJakartaDate(new Date());
    const start = new Date(`${today}T00:00:00.000+07:00`);
    const end = new Date(`${today}T23:59:59.999+07:00`);

    const [todayBookings, pendingRequests, upcomingBookings, notifications, unreadCount, availabilityWindows, workspaces] =
      await Promise.all([
        prisma.booking.findMany({
          where: { lecturerId: lecturer.id, status: "APPROVED", startAt: { gte: start, lte: end } },
          orderBy: { startAt: "asc" },
          include: { student: true, workspace: true }
        }),
        prisma.bookingRequest.findMany({
          where: { lecturerId: lecturer.id, status: "PENDING" },
          orderBy: { requestedStartAt: "asc" },
          take: 10,
          include: { student: true }
        }),
        prisma.booking.findMany({
          where: { lecturerId: lecturer.id, status: "APPROVED", startAt: { gte: new Date() } },
          orderBy: { startAt: "asc" },
          take: 5,
          include: { student: true, workspace: true }
        }),
        prisma.notification.findMany({
          where: { recipientUserId: userId },
          orderBy: { createdAt: "desc" },
          take: 10
        }),
        prisma.notification.count({ where: { recipientUserId: userId, readAt: null } }),
        prisma.availabilityWindow.findMany({
          where: { lecturerId: lecturer.id, deletedAt: null },
          orderBy: { createdAt: "desc" },
          take: 5,
          include: { exceptions: { orderBy: { exceptionDate: "asc" }, take: 3 } }
        }),
        prisma.sessionWorkspace.findMany({
          where: { lecturerId: lecturer.id },
          orderBy: { createdAt: "desc" },
          take: 5,
          include: { student: true, booking: true }
        })
      ]);

    return {
      profile: lecturer,
      todayBookings,
      pendingRequests,
      upcomingBookings,
      availabilityWindows,
      recentWorkspaces: workspaces,
      notifications,
      unreadCount
    };
  }
};
