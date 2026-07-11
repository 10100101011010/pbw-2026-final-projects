import { prisma } from "../../lib/prisma.js";

export const studentRepository = {
  findByUserId(userId: string) {
    return prisma.studentProfile.findUnique({
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
  },

  findLecturerByUserId(userId: string) {
    return prisma.lecturerProfile.findUnique({
      where: { userId },
      include: { user: true }
    });
  }
};
