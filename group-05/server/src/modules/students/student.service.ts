import { prisma } from "../../lib/prisma.js";
import { badRequest, forbidden, notFound } from "../../utils/errors.js";
import { availabilityService } from "../availability/availability.service.js";
import { calculateEligibility } from "./eligibility.service.js";

export const studentService = {
  async eligibility(userId: string) {
    const student = await prisma.studentProfile.findUnique({
      where: { userId },
      include: { user: true, supervisors: { where: { isActive: true } } }
    });
    if (!student) throw forbidden("Student profile is required.");
    return calculateEligibility(student.user, student, student.supervisors);
  },

  async supervisors(userId: string) {
    const student = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        supervisors: {
          where: { isActive: true },
          orderBy: { order: "asc" },
          include: { lecturer: { include: { user: true } } }
        }
      }
    });
    if (!student) throw forbidden("Student profile is required.");
    return student.supervisors;
  },

  async supervisorAvailability(userId: string, lecturerId: string, start: string, end: string) {
    const student = await prisma.studentProfile.findUnique({
      where: { userId },
      include: { user: true, supervisors: { where: { isActive: true } } }
    });
    if (!student) throw forbidden("Student profile is required.");
    const eligibility = calculateEligibility(student.user, student, student.supervisors);
    if (!eligibility.eligible) {
      throw forbidden(eligibility.reasons[0] || "Student is not academically eligible.");
    }
    const supervisor = student.supervisors.find((item) => item.lecturerId === lecturerId);
    if (!supervisor) throw forbidden("Students may view availability only for assigned supervisors.");
    if (end < start) throw badRequest("INVALID_DATE_RANGE", "End date cannot be before start date.");
    return availabilityService.generateSlots(lecturerId, start, end);
  },

  async history(user: Express.AuthUser) {
    const profileId = user.role === "STUDENT" ? user.studentProfileId : user.lecturerProfileId;
    if (!profileId) throw notFound("Profile not found.");
    const where =
      user.role === "STUDENT"
        ? { studentId: profileId }
        : { lecturerId: profileId };
    return prisma.sessionWorkspace.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        student: true,
        lecturer: true,
        booking: true,
        notes: { orderBy: { createdAt: "desc" } },
        feedback: { orderBy: { createdAt: "desc" } },
        revisions: { orderBy: { versionNumber: "desc" }, include: { attachments: true } }
      }
    });
  }
};
