import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../generated/prisma/client.js";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";
import { forbidden, unauthorized } from "../utils/errors.js";

type AccessTokenPayload = {
  sub: string;
  role: UserRole;
};

const extractBearerToken = (req: Request) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length);
};

export const requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = extractBearerToken(req);
    if (!token) throw unauthorized();

    const payload = jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { studentProfile: true, lecturerProfile: true }
    });

    if (!user || user.status !== "ACTIVE" || user.deletedAt) {
      throw unauthorized("Your session is no longer valid.");
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      studentProfileId: user.studentProfile?.id,
      lecturerProfileId: user.lecturerProfile?.id
    };
    next();
  } catch (error) {
    next(error instanceof Error && error.name === "JsonWebTokenError" ? unauthorized() : error);
  }
};

export const requireRole =
  (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(unauthorized());
    if (!roles.includes(req.user.role)) return next(forbidden());
    return next();
  };
