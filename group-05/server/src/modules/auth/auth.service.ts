import bcrypt from "bcrypt";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import type { UserRole } from "../../generated/prisma/client.js";
import { env } from "../../config/env.js";
import { prisma } from "../../lib/prisma.js";
import { auditService } from "../audit/audit.service.js";
import { calculateEligibility } from "../students/eligibility.service.js";
import { badRequest, unauthorized } from "../../utils/errors.js";

type RequestMeta = {
  ip?: string | undefined;
  userAgent?: string | undefined;
};

const hashToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

const signAccessToken = (userId: string, role: UserRole) =>
  jwt.sign({ role }, env.JWT_SECRET, {
    subject: userId,
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as StringValue
  });

const createRefreshToken = async (userId: string, meta: RequestMeta) => {
  const token = crypto.randomBytes(64).toString("hex");
  const expiresAt = new Date(Date.now() + env.JWT_REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt,
      createdByIp: meta.ip ?? null,
      userAgent: meta.userAgent ?? null
    }
  });
  return { token, expiresAt };
};

const buildUserPayload = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      studentProfile: {
        include: {
          supervisors: {
            where: { isActive: true },
            orderBy: { order: "asc" },
            include: { lecturer: { include: { user: true } } }
          }
        }
      },
      lecturerProfile: true
    }
  });
  if (!user) throw unauthorized();

  const eligibility = user.studentProfile
    ? calculateEligibility(user, user.studentProfile, user.studentProfile.supervisors)
    : null;

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
    profile: user.role === "STUDENT" ? user.studentProfile : user.lecturerProfile,
    eligibility
  };
};

export const authService = {
  async login(email: string, password: string, meta: RequestMeta) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { studentProfile: true, lecturerProfile: true }
    });

    if (!user || user.deletedAt || user.status !== "ACTIVE") {
      throw unauthorized("Incorrect email or password.");
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      throw unauthorized("Incorrect email or password.");
    }

    if (user.role === "STUDENT" && !email.endsWith("@student.gunadarma.ac.id")) {
      throw badRequest("INVALID_STUDENT_EMAIL", "Students must use an official Gunadarma student email.");
    }

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    await auditService.record({
      actorUserId: user.id,
      action: "LOGIN_SUCCESS",
      entityType: "users",
      entityId: user.id,
      ipAddress: meta.ip,
      userAgent: meta.userAgent
    });

    const accessToken = signAccessToken(user.id, user.role);
    const refreshToken = await createRefreshToken(user.id, meta);

    return {
      accessToken,
      refreshToken: refreshToken.token,
      refreshTokenExpiresAt: refreshToken.expiresAt,
      user: await buildUserPayload(user.id)
    };
  },

  async refresh(refreshToken: string | undefined, meta: RequestMeta) {
    if (!refreshToken) throw unauthorized("Refresh token is required.");
    const tokenHash = hashToken(refreshToken);
    const record = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true }
    });

    if (!record || record.revokedAt || record.expiresAt < new Date() || record.user.status !== "ACTIVE") {
      throw unauthorized("Refresh token is invalid.");
    }

    await prisma.refreshToken.update({
      where: { id: record.id },
      data: { revokedAt: new Date() }
    });

    const nextRefresh = await createRefreshToken(record.userId, meta);
    return {
      accessToken: signAccessToken(record.userId, record.user.role),
      refreshToken: nextRefresh.token,
      refreshTokenExpiresAt: nextRefresh.expiresAt,
      user: await buildUserPayload(record.userId)
    };
  },

  async logout(refreshToken?: string) {
    if (!refreshToken) return;
    await prisma.refreshToken.updateMany({
      where: { tokenHash: hashToken(refreshToken), revokedAt: null },
      data: { revokedAt: new Date() }
    });
  },

  me(userId: string) {
    return buildUserPayload(userId);
  }
};
