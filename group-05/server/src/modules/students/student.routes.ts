import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { sendOk } from "../../utils/api-response.js";
import { dashboardService } from "../dashboards/dashboard.service.js";
import { studentService } from "./student.service.js";

export const studentRoutes = Router();

studentRoutes.use(requireAuth, requireRole("STUDENT"));

studentRoutes.get(
  "/dashboard",
  asyncHandler(async (req, res) => {
    sendOk(res, await dashboardService.studentDashboard(req.user!.id));
  })
);

studentRoutes.get(
  "/eligibility",
  asyncHandler(async (req, res) => {
    sendOk(res, await studentService.eligibility(req.user!.id));
  })
);

studentRoutes.get(
  "/supervisors",
  asyncHandler(async (req, res) => {
    sendOk(res, await studentService.supervisors(req.user!.id));
  })
);

studentRoutes.get(
  "/supervisors/:id/availability",
  validate({
    params: z.object({ id: z.string().uuid() }),
    query: z.object({ start: z.string().date(), end: z.string().date() })
  }),
  asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    const { start, end } = req.query as { start: string; end: string };
    sendOk(
      res,
      await studentService.supervisorAvailability(req.user!.id, id, start, end)
    );
  })
);

studentRoutes.get(
  "/history",
  asyncHandler(async (req, res) => {
    sendOk(res, await studentService.history(req.user!));
  })
);
