import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { titleCase } from "../../lib/utils";

const labelMap: Record<string, string> = {
  student: "Student",
  lecturer: "Lecturer",
  dashboard: "Dashboard",
  booking: "Booking",
  availability: "Availability Calendar",
  workspace: "Session Workspace",
  revisions: "Revision History",
  notifications: "Notifications",
  profile: "Profile",
  settings: "Settings"
};

export function Breadcrumb() {
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);
  if (parts.length === 0) return null;

  return (
    <nav className="hidden items-center gap-1.5 text-sm text-muted-foreground md:flex" aria-label="Breadcrumb">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-foreground">
        <Home className="h-4 w-4" aria-hidden="true" />
        Home
      </Link>
      {parts.map((part, index) => {
        const href = `/${parts.slice(0, index + 1).join("/")}`;
        const isLast = index === parts.length - 1;
        return (
          <span key={href} className="inline-flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" aria-hidden="true" />
            {isLast ? (
              <span className="font-semibold tracking-tight text-foreground">{labelMap[part] ?? titleCase(part)}</span>
            ) : (
              <Link to={href} className="transition-colors duration-150 hover:text-foreground">
                {labelMap[part] ?? titleCase(part)}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
