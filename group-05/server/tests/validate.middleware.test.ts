import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { validate } from "../src/middleware/validate.middleware.js";
import { AppError } from "../src/utils/errors.js";

// Mirrors calendarQuerySchema / listBookingQuerySchema: optional ISO dates plus a coerced,
// defaulted numeric field, so the test covers both the getter-only-reassignment fix and that
// coercion/defaults are still applied to req.query.
const querySchema = z.object({
  start: z.string().date().optional(),
  end: z.string().date().optional(),
  page: z.coerce.number().int().positive().default(1)
});

const buildApp = () => {
  const app = express();
  app.get("/slots", validate({ query: querySchema }), (req, res) => {
    res.json({ success: true, data: { query: req.query } });
  });
  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ success: false, error: { code: error.code, message: error.message, details: error.details } });
      return;
    }
    res.status(500).json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "unexpected" } });
  });
  return app;
};

describe("validate middleware query handling (Express 5 getter-only req.query)", () => {
  it("returns 200 for a valid calendar range and exposes the parsed query to the handler", async () => {
    const response = await request(buildApp()).get("/slots").query({ start: "2026-07-06", end: "2026-08-05" });

    expect(response.status).toBe(200);
    expect(response.body.data.query.start).toBe("2026-07-06");
    expect(response.body.data.query.end).toBe("2026-08-05");
    // Coerced + defaulted value is written back onto req.query (page omitted by the client).
    expect(response.body.data.query.page).toBe(1);
  });

  it("returns 400 VALIDATION_ERROR with structured field issues for an invalid date", async () => {
    const response = await request(buildApp()).get("/slots").query({ start: "not-a-date" });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(Array.isArray(response.body.error.details.issues)).toBe(true);
    expect(response.body.error.details.issues[0].path).toBe("start");
  });
});
