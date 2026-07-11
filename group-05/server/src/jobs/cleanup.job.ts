import cron from "node-cron";
import { prisma } from "../lib/prisma.js";
import { logger } from "../lib/logger.js";

export const cleanupExpiredRecords = async () => {
  const now = new Date();
  await prisma.bookingRequest.updateMany({
    where: { status: "PENDING", expiresAt: { lt: now } },
    data: { status: "EXPIRED" }
  });
  await prisma.refreshToken.deleteMany({
    where: { OR: [{ expiresAt: { lt: now } }, { revokedAt: { lt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } }] }
  });
};

export const startCleanupJob = () => {
  cron.schedule("30 * * * *", () => {
    cleanupExpiredRecords().catch((error: unknown) => logger.error({ error }, "Cleanup job failed"));
  });
};
