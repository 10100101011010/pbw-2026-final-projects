import type { UserRole } from "../generated/prisma/client.js";

declare global {
  namespace Express {
    interface AuthUser {
      id: string;
      email: string;
      role: UserRole;
      status: string;
      studentProfileId?: string | undefined;
      lecturerProfileId?: string | undefined;
    }

    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
