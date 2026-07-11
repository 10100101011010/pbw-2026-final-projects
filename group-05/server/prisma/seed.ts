import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const passwordHash = await bcrypt.hash("Password123!", 12);

const dateOnly = (value: string) => new Date(`${value}T00:00:00.000+07:00`);

async function main() {
  const studentUser = await prisma.user.upsert({
    where: { email: "ayu@student.gunadarma.ac.id" },
    update: { passwordHash, status: "ACTIVE" },
    create: {
      email: "ayu@student.gunadarma.ac.id",
      passwordHash,
      role: "STUDENT",
      status: "ACTIVE",
      studentProfile: {
        create: {
          npm: "50420999",
          fullName: "Ayu Prameswari",
          studyProgram: "Informatika",
          completedSks: 148,
          piCompleted: true,
          isSarMag: false,
          academicStatus: "ELIGIBLE"
        }
      }
    },
    include: { studentProfile: true }
  });

  const sarMagUser = await prisma.user.upsert({
    where: { email: "rangga@student.gunadarma.ac.id" },
    update: { passwordHash, status: "ACTIVE" },
    create: {
      email: "rangga@student.gunadarma.ac.id",
      passwordHash,
      role: "STUDENT",
      status: "ACTIVE",
      studentProfile: {
        create: {
          npm: "50420988",
          fullName: "Rangga Mahendra",
          studyProgram: "Sarjana-Magister Informatika",
          completedSks: 144,
          piCompleted: false,
          isSarMag: true,
          academicStatus: "ELIGIBLE"
        }
      }
    },
    include: { studentProfile: true }
  });

  const lecturerOneUser = await prisma.user.upsert({
    where: { email: "diana@staff.gunadarma.ac.id" },
    update: { passwordHash, status: "ACTIVE" },
    create: {
      email: "diana@staff.gunadarma.ac.id",
      passwordHash,
      role: "LECTURER",
      status: "ACTIVE",
      lecturerProfile: {
        create: {
          lecturerCode: "DIA001",
          fullName: "Dr. Diana Kartika",
          academicTitle: "Dr.",
          department: "Fakultas Teknologi Industri",
          officeLocation: "Kampus D, Ruang D421",
          consultationNotes: "Bring latest thesis draft and previous feedback."
        }
      }
    },
    include: { lecturerProfile: true }
  });

  const lecturerTwoUser = await prisma.user.upsert({
    where: { email: "budi@staff.gunadarma.ac.id" },
    update: { passwordHash, status: "ACTIVE" },
    create: {
      email: "budi@staff.gunadarma.ac.id",
      passwordHash,
      role: "LECTURER",
      status: "ACTIVE",
      lecturerProfile: {
        create: {
          lecturerCode: "BUD002",
          fullName: "Dr. Budi Santoso",
          academicTitle: "Dr.",
          department: "Fakultas Teknologi Industri",
          officeLocation: "Kampus E, Ruang E312",
          consultationNotes: "Online supervision is available by prior agreement."
        }
      }
    },
    include: { lecturerProfile: true }
  });

  const studentIds = [studentUser.studentProfile?.id, sarMagUser.studentProfile?.id].filter(Boolean) as string[];
  const lecturerOneId = lecturerOneUser.lecturerProfile!.id;
  const lecturerTwoId = lecturerTwoUser.lecturerProfile!.id;

  for (const studentId of studentIds) {
    await prisma.studentSupervisor.upsert({
      where: { studentId_order: { studentId, order: "FIRST" } },
      update: { lecturerId: lecturerOneId, isActive: true },
      create: { studentId, lecturerId: lecturerOneId, order: "FIRST", isActive: true }
    });
    await prisma.studentSupervisor.upsert({
      where: { studentId_order: { studentId, order: "SECOND" } },
      update: { lecturerId: lecturerTwoId, isActive: true },
      create: { studentId, lecturerId: lecturerTwoId, order: "SECOND", isActive: true }
    });
  }

  await prisma.availabilityWindow.deleteMany({ where: { lecturerId: { in: [lecturerOneId, lecturerTwoId] } } });

  const tuesdayMorning = await prisma.availabilityWindow.create({
    data: {
      lecturerId: lecturerOneId,
      windowType: "RECURRING",
      dayOfWeek: 2,
      startTime: "09:00",
      endTime: "12:00",
      slotDurationMinutes: 30,
      recurrenceStartDate: dateOnly("2026-07-01")
    }
  });

  await prisma.availabilityWindow.create({
    data: {
      lecturerId: lecturerOneId,
      windowType: "ONE_TIME",
      specificDate: dateOnly("2026-07-10"),
      startTime: "13:00",
      endTime: "15:00",
      slotDurationMinutes: 60
    }
  });

  await prisma.availabilityWindow.create({
    data: {
      lecturerId: lecturerTwoId,
      windowType: "RECURRING",
      dayOfWeek: 4,
      startTime: "10:00",
      endTime: "12:00",
      slotDurationMinutes: 30,
      recurrenceStartDate: dateOnly("2026-07-01")
    }
  });

  await prisma.availabilityException.create({
    data: {
      availabilityWindowId: tuesdayMorning.id,
      lecturerId: lecturerOneId,
      exceptionDate: dateOnly("2026-07-14"),
      exceptionType: "CANCELLED",
      reason: "Faculty seminar"
    }
  });

  console.log("Seed completed.");
  console.log("Student: ayu@student.gunadarma.ac.id / Password123!");
  console.log("Lecturer: diana@staff.gunadarma.ac.id / Password123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
