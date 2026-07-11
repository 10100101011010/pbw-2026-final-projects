export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export const unauthorized = (message = "Authentication required.") =>
  new AppError(401, "UNAUTHORIZED", message);

export const forbidden = (message = "You are not allowed to access this resource.") =>
  new AppError(403, "FORBIDDEN", message);

export const notFound = (message = "Resource not found.") =>
  new AppError(404, "NOT_FOUND", message);

export const conflict = (code: string, message: string, details?: unknown) =>
  new AppError(409, code, message, details);

export const badRequest = (code: string, message: string, details?: unknown) =>
  new AppError(400, code, message, details);
