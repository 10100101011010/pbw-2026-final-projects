import { Link } from "react-router-dom";
import bimbingan3 from "../assets/images/bimbingan-3-800.webp";
import { Brand } from "../components/layout/brand";
import { buttonVariants } from "../components/ui/button-variants";
import { useAuth } from "../features/auth/auth-context";
import { getDashboardPath } from "../lib/user";

export function UnauthorizedPage() {
  const { role } = useAuth();

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-10">
      <div className="max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <Brand />
        </div>
        <img src={bimbingan3} alt="" className="mx-auto mb-6 h-28 w-28 rounded-full object-cover shadow-panel" />
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">Access unavailable</p>
        <h1 className="mt-3 font-display text-h1 font-bold tracking-tight">This area isn't part of your role.</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          GTGS keeps student and lecturer workflows separate to protect academic data and booking decisions. Let's get
          you back to your own dashboard.
        </p>
        <Link to={getDashboardPath(role)} className={buttonVariants({ className: "mt-6" })}>
          Return to dashboard
        </Link>
      </div>
    </main>
  );
}
