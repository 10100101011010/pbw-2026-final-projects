import {
  Bell,
  BookOpenCheck,
  CalendarDays,
  ClipboardList,
  History,
  LayoutDashboard,
  Settings,
  UserRound,
  UsersRound
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Brand } from "./brand";
import { cn } from "../../lib/utils";
import type { UserRole } from "../../services/types";

type NavItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  roles?: UserRole[];
};

const navItems: NavItem[] = [
  { label: "Student Dashboard", href: "/student/dashboard", icon: LayoutDashboard, roles: ["STUDENT"] },
  { label: "Lecturer Dashboard", href: "/lecturer/dashboard", icon: LayoutDashboard, roles: ["LECTURER"] },
  { label: "Booking", href: "/booking", icon: ClipboardList },
  { label: "Availability", href: "/availability", icon: CalendarDays },
  { label: "Session Workspace", href: "/workspace", icon: UsersRound },
  { label: "Revision History", href: "/revisions", icon: History },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Profile", href: "/profile", icon: UserRound },
  { label: "Settings", href: "/settings", icon: Settings }
];

type SidebarProps = {
  role: UserRole;
  onNavigate?: () => void;
};

export function Sidebar({ role, onNavigate }: SidebarProps) {
  const visibleItems = navItems.filter((item) => !item.roles || item.roles.includes(role));

  return (
    <aside className="flex h-full flex-col gap-6">
      <div className="px-2 pb-1">
        <Brand />
      </div>
      <nav className="grid gap-1 px-1" aria-label="Main navigation">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground",
                  isActive && "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-primary transition-opacity duration-150",
                      isActive ? "opacity-100" : "opacity-0"
                    )}
                    aria-hidden="true"
                  />
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
      <div className="mt-auto rounded-xl border bg-muted/40 p-4 text-sm">
        <div className="mb-2 flex items-center gap-2 font-display font-semibold tracking-tight">
          <BookOpenCheck className="h-4 w-4 text-primary" aria-hidden="true" />
          Academic Lifecycle
        </div>
        <p className="leading-relaxed text-muted-foreground">
          Eligibility, scheduling, supervision notes, and revisions stay connected.
        </p>
      </div>
    </aside>
  );
}
