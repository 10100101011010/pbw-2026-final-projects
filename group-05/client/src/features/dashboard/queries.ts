import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../../services/dashboards";

export const dashboardKeys = {
  student: ["dashboard", "student"] as const,
  lecturer: ["dashboard", "lecturer"] as const
};

export const useStudentDashboard = () =>
  useQuery({
    queryKey: dashboardKeys.student,
    queryFn: dashboardService.student
  });

export const useLecturerDashboard = () =>
  useQuery({
    queryKey: dashboardKeys.lecturer,
    queryFn: dashboardService.lecturer
  });
