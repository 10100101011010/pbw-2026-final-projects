import cron from "node-cron";
import { prisma } from "../lib/prisma.js";
import { logger } from "../lib/logger.js";
import { notificationService } from "../modules/notifications/notification.service.js";

export const dispatchReminders = async () => {
  const now = new Date();
  const soon = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const bookings = await prisma.booking.findMany({
    where: {
      status: "APPROVED",
      reminderSentAt: null,
      startAt: { gte: now, lte: soon }
    },
    include: {
      student: { include: { user: true } },
      lecturer: { include: { user: true } }
    },
    take: 100
  });

  for (const booking of bookings) {
    await notificationService.create({
      recipientUserId: booking.student.userId,
      type: "SESSION_REMINDER",
      title: "Supervision reminder",
      message: "You have an approved supervision session within 24 hours.",
      entityType: "bookings",
      entityId: booking.id
    });
    await notificationService.create({
      recipientUserId: booking.lecturer.userId,
      type: "SESSION_REMINDER",
      title: "Supervision reminder",
      message: "You have an approved supervision session within 24 hours.",
      entityType: "bookings",
      entityId: booking.id
    });
    await prisma.booking.update({ where: { id: booking.id }, data: { reminderSentAt: new Date() } });
  }
};

export const startReminderJob = () => {
  cron.schedule("0 * * * *", () => {
    dispatchReminders().catch((error: unknown) => logger.error({ error }, "Reminder job failed"));
  });
};
