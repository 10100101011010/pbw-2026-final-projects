import nodemailer from "nodemailer";
import type { NotificationType, Prisma } from "../../generated/prisma/client.js";
import { env } from "../../config/env.js";
import { logger } from "../../lib/logger.js";
import { prisma } from "../../lib/prisma.js";

type NotificationInput = {
  recipientUserId: string;
  type: NotificationType;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
};

const canSendEmail = Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);

const transporter = canSendEmail
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
      }
    })
  : null;

export const notificationService = {
  async create(input: NotificationInput, tx: Prisma.TransactionClient = prisma) {
    const notification = await tx.notification.create({
      data: {
        recipientUserId: input.recipientUserId,
        type: input.type,
        title: input.title,
        message: input.message,
        entityType: input.entityType ?? null,
        entityId: input.entityId ?? null
      },
      include: { recipient: true }
    });

    const emailAttempt = await tx.emailDeliveryAttempt.create({
      data: {
        notificationId: notification.id,
        recipientUserId: input.recipientUserId,
        email: notification.recipient.email,
        status: canSendEmail ? "PENDING" : "FAILED",
        lastError: canSendEmail ? null : "SMTP is not configured."
      }
    });

    if (transporter) {
      transporter
        .sendMail({
          from: env.SMTP_FROM,
          to: notification.recipient.email,
          subject: notification.title,
          text: notification.message
        })
        .then(async () => {
          await prisma.emailDeliveryAttempt.update({
            where: { id: emailAttempt.id },
            data: { status: "SENT", sentAt: new Date(), attemptCount: { increment: 1 } }
          });
        })
        .catch(async (error: unknown) => {
          logger.warn({ error }, "Email delivery failed");
          await prisma.emailDeliveryAttempt.update({
            where: { id: emailAttempt.id },
            data: {
              status: "FAILED",
              attemptCount: { increment: 1 },
              lastError: error instanceof Error ? error.message : "Unknown email error"
            }
          });
        });
    }

    return notification;
  },

  async list(recipientUserId: string, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [items, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { recipientUserId },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize
      }),
      prisma.notification.count({ where: { recipientUserId } }),
      prisma.notification.count({ where: { recipientUserId, readAt: null } })
    ]);
    return { items, pagination: { page, pageSize, total }, unreadCount };
  },

  async markRead(notificationId: string, recipientUserId: string) {
    return prisma.notification.update({
      where: { id: notificationId, recipientUserId },
      data: { readAt: new Date() }
    });
  },

  async markAllRead(recipientUserId: string) {
    await prisma.notification.updateMany({
      where: { recipientUserId, readAt: null },
      data: { readAt: new Date() }
    });
    return { updated: true };
  }
};
