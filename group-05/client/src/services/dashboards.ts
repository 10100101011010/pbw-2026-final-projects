import { apiRequest } from "./api";
import type { LecturerDashboard, StudentDashboard } from "./types";

export const dashboardService = {
  student: () => apiRequest<StudentDashboard>("/dashboards/student"),
  lecturer: () => apiRequest<LecturerDashboard>("/dashboards/lecturer")
};
