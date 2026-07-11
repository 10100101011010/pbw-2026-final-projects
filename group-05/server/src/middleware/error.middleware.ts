import { Prisma } from "../generated/prisma/client.js";
import type { NextFunction, Request, Response } from "express";
import { logger } from "../lib/logger.js";
import { AppError } from "../utils/errors.js";

export const notFoundMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(404, "ROUTE_NOT_FOUND", `Route ${req.method} ${req.path} not found.`));
};

export const errorMiddleware = (error: unknown, req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    logger.warn({ error, path: req.path }, "Database request failed");
    return res.status(400).json({
      success: false,
      error: {
        code: "DATABASE_REQUEST_FAILED",
        message: "The request could not be processed."
      }
    });
  }

  logger.error({ error, path: req.path }, "Unhandled API error");
  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Unexpected server error."
    }
  });
};
