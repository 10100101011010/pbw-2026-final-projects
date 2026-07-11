import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { sendCreated, sendOk } from "../../utils/api-response.js";
import { bookingService } from "./booking.service.js";
import { cancelBookingSchema, createBookingSchema, listBookingQuerySchema, rejectBookingSchema } from "./booking.schema.js";

export const bookingRoutes = Router();

bookingRoutes.use(requireAuth);

bookingRoutes.get(
  "/",
  validate({ query: listBookingQuerySchema }),
  asyncHandler(async (req, res) => {
    sendOk(
      res,
      await bookingService.list(
        req.user!,
        Number(req.query.page),
        Number(req.query.pageSize),
        req.query.status as string | undefined
      )
    );
  })
);

bookingRoutes.post(
  "/",
  requireRole("STUDENT"),
  validate({ body: createBookingSchema }),
  asyncHandler(async (req, res) => {
    sendCreated(
      res,
      await bookingService.createRequest(req.user!.id, req.body, {
        actorUserId: req.user!.id,
        ipAddress: req.ip,
        userAgent: req.get("user-agent")
      })
    );
  })
);

bookingRoutes.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    sendOk(res, await bookingService.get(id, req.user!));
  })
);

bookingRoutes.patch(
  "/:id/approve",
  requireRole("LECTURER"),
  asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    sendOk(
      res,
      await bookingService.approve(id, req.user!.id, {
        actorUserId: req.user!.id,
        ipAddress: req.ip,
        userAgent: req.get("user-agent")
      })
    );
  })
);

bookingRoutes.patch(
  "/:id/reject",
  requireRole("LECTURER"),
  validate({ body: rejectBookingSchema }),
  asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    sendOk(
      res,
      await bookingService.reject(id, req.user!.id, req.body.reason, {
        actorUserId: req.user!.id,
        ipAddress: req.ip,
        userAgent: req.get("user-agent")
      })
    );
  })
);

bookingRoutes.patch(
  "/:id/cancel",
  validate({ body: cancelBookingSchema }),
  asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    sendOk(
      res,
      await bookingService.cancel(id, req.user!, req.body.reason, {
        actorUserId: req.user!.id,
        ipAddress: req.ip,
        userAgent: req.get("user-agent")
      })
    );
  })
);

bookingRoutes.patch(
  "/:id/complete",
  requireRole("LECTURER"),
  asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    sendOk(
      res,
      await bookingService.complete(id, req.user!.id, {
        actorUserId: req.user!.id,
        ipAddress: req.ip,
        userAgent: req.get("user-agent")
      })
    );
  })
);
