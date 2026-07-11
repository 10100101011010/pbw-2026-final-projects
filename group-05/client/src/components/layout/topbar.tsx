import { Bell, LogOut, Menu, Moon, Search, Sun } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../app/theme-context";
import { useAuth } from "../../features/auth/auth-context";
import { getUserDisplayName, getUserSubtitle } from "../../lib/user";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Brand } from "./brand";
import { Breadcrumb } from "./breadcrumb";

type TopbarProps = {
  onMenuClick: () => void;
};

export function Topbar({ onMenuClick }: TopbarProps) {
  const { user, logout } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b bg-background/92 backdrop-blur">
      <div className="flex min-h-16 items-center gap-3 px-4 lg:px-6">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open navigation"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>
        <Brand compact className="lg:hidden" />
        <div className="min-w-0 flex-1">
          <Breadcrumb />
          <div className="mt-1 hidden max-w-sm items-center gap-2 rounded-lg border bg-muted/35 px-3 md:flex">
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              aria-label="Search GTGS"
              placeholder="Search schedules, sessions, notifications"
              className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          title="Toggle theme"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          {resolvedTheme === "dark" ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          title="Notifications"
          onClick={() => navigate("/notifications")}
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
        </Button>
        <Link
          to="/profile"
          className="hidden min-w-0 items-center gap-3 rounded-lg px-2 py-1.5 transition-colors duration-150 hover:bg-muted sm:flex"
        >
          <Avatar name={getUserDisplayName(user)} />
          <span className="grid min-w-0 leading-tight">
            <span className="truncate text-sm font-semibold tracking-tight">{getUserDisplayName(user)}</span>
            <span className="truncate text-xs text-muted-foreground">{getUserSubtitle(user)}</span>
          </span>
        </Link>
        <Button type="button" variant="ghost" size="icon" aria-label="Logout" title="Logout" onClick={handleLogout}>
          <LogOut className="h-5 w-5" aria-hidden="true" />
        </Button>
      </div>
    </header>
  );
}
