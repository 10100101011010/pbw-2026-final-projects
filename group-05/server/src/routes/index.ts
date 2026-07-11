import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes.js";
import { availabilityRoutes } from "../modules/availability/availability.routes.js";
import { bookingRoutes } from "../modules/bookings/booking.routes.js";
import { dashboardRoutes } from "../modules/dashboards/dashboard.routes.js";
import { lecturerRoutes } from "../modules/dashboards/lecturer.routes.js";
import { notificationRoutes } from "../modules/notifications/notification.routes.js";
import { studentRoutes } from "../modules/students/student.routes.js";
import { workspaceRoutes } from "../modules/workspaces/workspace.routes.js";

export const apiRoutes = Router();

apiRoutes.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok", service: "gtgs-api" } });
});

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/student", studentRoutes);
apiRoutes.use("/lecturer", lecturerRoutes);
apiRoutes.use("/lecturer/availability", availabilityRoutes);
apiRoutes.use("/dashboards", dashboardRoutes);
apiRoutes.use("/bookings", bookingRoutes);
apiRoutes.use("/workspaces", workspaceRoutes);
apiRoutes.use("/notifications", notificationRoutes);
