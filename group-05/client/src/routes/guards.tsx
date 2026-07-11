import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loading } from "../components/ui/loading";
import { useAuth } from "../features/auth/auth-context";
import { getDashboardPath } from "../lib/user";
import type { UserRole } from "../services/types";

export function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <Loading label="Checking session" className="min-h-svh" />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
}

export function RequireRole({ roles }: { roles: UserRole[] }) {
  const { role } = useAuth();
  if (!role) return <Navigate to="/login" replace />;
  if (!roles.includes(role)) return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
}

export function RoleRedirect() {
  const { role } = useAuth();
  return <Navigate to={getDashboardPath(role)} replace />;
}
