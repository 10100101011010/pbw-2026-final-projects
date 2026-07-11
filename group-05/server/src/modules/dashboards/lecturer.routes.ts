import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { sendOk } from "../../utils/api-response.js";
import { dashboardService } from "./dashboard.service.js";
import { studentService } from "../students/student.service.js";

export const lecturerRoutes = Router();

lecturerRoutes.use(requireAuth, requireRole("LECTURER"));

lecturerRoutes.get(
  "/dashboard",
  asyncHandler(async (req, res) => {
    sendOk(res, await dashboardService.lecturerDashboard(req.user!.id));
  })
);

lecturerRoutes.get(
  "/history",
  asyncHandler(async (req, res) => {
    sendOk(res, await studentService.history(req.user!));
  })
);
