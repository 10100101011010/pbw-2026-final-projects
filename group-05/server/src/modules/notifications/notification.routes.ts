import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { sendOk } from "../../utils/api-response.js";
import { notificationService } from "./notification.service.js";

export const notificationRoutes = Router();

notificationRoutes.use(requireAuth);

notificationRoutes.get(
  "/",
  validate({
    query: z.object({
      page: z.coerce.number().int().positive().default(1),
      pageSize: z.coerce.number().int().positive().max(50).default(20)
    })
  }),
  asyncHandler(async (req, res) => {
    sendOk(res, await notificationService.list(req.user!.id, Number(req.query.page), Number(req.query.pageSize)));
  })
);

notificationRoutes.patch(
  "/read-all",
  asyncHandler(async (req, res) => {
    sendOk(res, await notificationService.markAllRead(req.user!.id));
  })
);

notificationRoutes.patch(
  "/:id/read",
  asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    sendOk(res, await notificationService.markRead(id, req.user!.id));
  })
);
