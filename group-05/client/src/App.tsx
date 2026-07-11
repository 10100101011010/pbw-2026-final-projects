import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AppProviders } from "./app/providers";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { PublicLayout } from "./layouts/PublicLayout";
import { AvailabilityPage } from "./pages/AvailabilityPage";
import { BookingPage } from "./pages/BookingPage";
import { LandingPage } from "./pages/LandingPage";
import { LecturerDashboardPage } from "./pages/LecturerDashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RevisionsPage } from "./pages/RevisionsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { StudentDashboardPage } from "./pages/StudentDashboardPage";
import { UnauthorizedPage } from "./pages/UnauthorizedPage";
import { WorkspacePage } from "./pages/WorkspacePage";
import { RequireAuth, RequireRole, RoleRedirect } from "./routes/guards";

export default function App() {
  return (
    <AppProviders>
      <Router>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="login" element={<LoginPage />} />
          </Route>

          <Route element={<RequireAuth />}>
            <Route path="dashboard" element={<RoleRedirect />} />
            <Route path="unauthorized" element={<UnauthorizedPage />} />
            <Route element={<DashboardLayout />}>
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="booking" element={<BookingPage />} />
              <Route path="workspace" element={<WorkspacePage />} />
              <Route path="revisions" element={<RevisionsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />

              <Route element={<RequireRole roles={["STUDENT"]} />}>
                <Route path="student/dashboard" element={<StudentDashboardPage />} />
              </Route>

              <Route element={<RequireRole roles={["LECTURER"]} />}>
                <Route path="lecturer/dashboard" element={<LecturerDashboardPage />} />
                <Route path="availability" element={<AvailabilityPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="student" element={<Navigate to="/student/dashboard" replace />} />
          <Route path="lecturer" element={<Navigate to="/lecturer/dashboard" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AppProviders>
  );
}
