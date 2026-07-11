import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { sendOk } from "../../utils/api-response.js";
import { dashboardService } from "./dashboard.service.js";

export const dashboardRoutes = Router();

dashboardRoutes.get(
  "/student",
  requireAuth,
  requireRole("STUDENT"),
  asyncHandler(async (req, res) => {
    sendOk(res, await dashboardService.studentDashboard(req.user!.id));
  })
);

dashboardRoutes.get(
  "/lecturer",
  requireAuth,
  requireRole("LECTURER"),
  asyncHandler(async (req, res) => {
    sendOk(res, await dashboardService.lecturerDashboard(req.user!.id));
  })
);
