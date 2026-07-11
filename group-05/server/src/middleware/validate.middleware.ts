import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodSchema } from "zod";
import { badRequest } from "../utils/errors.js";

type Schemas = {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
};

export const validate =
  (schemas: Schemas) => (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.params) req.params = schemas.params.parse(req.params) as Record<string, string>;
      if (schemas.query) {
        // Express 5 exposes `req.query` as a getter-only property, so `req.query = ...` throws a
        // TypeError ("Cannot set property query ... which has only a getter"). Redefine it as a
        // writable data property instead, so the parsed/coerced/defaulted result is available to
        // downstream handlers. (`req.body` and `req.params` remain writable and are left as-is.)
        const parsedQuery = schemas.query.parse(req.query);
        Object.defineProperty(req, "query", {
          value: parsedQuery,
          writable: true,
          enumerable: true,
          configurable: true
        });
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message }));
        next(badRequest("VALIDATION_ERROR", "Request validation failed.", { issues }));
        return;
      }
      next(badRequest("VALIDATION_ERROR", "Request validation failed.", error));
    }
  };
