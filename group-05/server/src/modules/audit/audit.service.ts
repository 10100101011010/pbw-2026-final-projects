import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

type AuditInput = {
  actorUserId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  oldValues?: Prisma.InputJsonValue | undefined;
  newValues?: Prisma.InputJsonValue | undefined;
  ipAddress?: string | null | undefined;
  userAgent?: string | null | undefined;
};

export const auditService = {
  async record(input: AuditInput, tx: Prisma.TransactionClient = prisma) {
    await tx.auditLog.create({
      data: {
        actorUserId: input.actorUserId ?? null,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId ?? null,
        oldValues: input.oldValues ?? Prisma.JsonNull,
        newValues: input.newValues ?? Prisma.JsonNull,
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null
      }
    });
  }
};
