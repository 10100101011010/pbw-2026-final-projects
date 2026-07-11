import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { sendCreated, sendOk } from "../../utils/api-response.js";
import { forbidden } from "../../utils/errors.js";
import { availabilityExceptionSchema, availabilityWindowSchema, calendarQuerySchema } from "./availability.schema.js";
import { availabilityService } from "./availability.service.js";

export const availabilityRoutes = Router();

availabilityRoutes.use(requireAuth, requireRole("LECTURER"));

availabilityRoutes.get(
  "/",
  asyncHandler(async (req, res) => {
    if (!req.user!.lecturerProfileId) throw forbidden();
    sendOk(res, await availabilityService.listWindows(req.user!.lecturerProfileId));
  })
);

availabilityRoutes.get(
  "/slots",
  validate({ query: calendarQuerySchema }),
  asyncHandler(async (req, res) => {
    if (!req.user!.lecturerProfileId) throw forbidden();
    const start = (req.query.start as string | undefined) ?? new Date().toISOString().slice(0, 10);
    const end = (req.query.end as string | undefined) ?? start;
    sendOk(res, await availabilityService.generateSlots(req.user!.lecturerProfileId, start, end));
  })
);

availabilityRoutes.post(
  "/",
  validate({ body: availabilityWindowSchema }),
  asyncHandler(async (req, res) => {
    if (!req.user!.lecturerProfileId) throw forbidden();
    sendCreated(res, await availabilityService.createWindow(req.user!.lecturerProfileId, req.body, req.user!.id));
  })
);

availabilityRoutes.put(
  "/:id",
  validate({ params: z.object({ id: z.string().uuid() }), body: availabilityWindowSchema }),
  asyncHandler(async (req, res) => {
    if (!req.user!.lecturerProfileId) throw forbidden();
    const { id } = req.params as { id: string };
    sendOk(res, await availabilityService.updateWindow(req.user!.lecturerProfileId, id, req.body, req.user!.id));
  })
);

availabilityRoutes.delete(
  "/:id",
  validate({ params: z.object({ id: z.string().uuid() }) }),
  asyncHandler(async (req, res) => {
    if (!req.user!.lecturerProfileId) throw forbidden();
    const { id } = req.params as { id: string };
    sendOk(res, await availabilityService.deleteWindow(req.user!.lecturerProfileId, id, req.user!.id));
  })
);

availabilityRoutes.post(
  "/:id/exceptions",
  validate({ params: z.object({ id: z.string().uuid() }), body: availabilityExceptionSchema }),
  asyncHandler(async (req, res) => {
    if (!req.user!.lecturerProfileId) throw forbidden();
    const { id } = req.params as { id: string };
    sendCreated(
      res,
      await availabilityService.createException(req.user!.lecturerProfileId, id, req.body, req.user!.id)
    );
  })
);
