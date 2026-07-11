import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/layout/sidebar";
import { Topbar } from "../components/layout/topbar";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "../components/ui/drawer";
import { useAuth } from "../features/auth/auth-context";

export function DashboardLayout() {
  const { role } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!role) return null;

  return (
    <div className="min-h-svh bg-background">
      <div className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r bg-card p-5 lg:block">
        <Sidebar role={role} />
      </div>
      <Drawer open={mobileOpen} onOpenChange={setMobileOpen}>
        <DrawerContent side="left" className="p-5">
          <DrawerTitle className="sr-only">Navigation</DrawerTitle>
          <DrawerDescription className="sr-only">Primary GTGS navigation links</DrawerDescription>
          <Sidebar role={role} onNavigate={() => setMobileOpen(false)} />
        </DrawerContent>
      </Drawer>
      <div className="lg:pl-72">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
