import { Link } from "react-router-dom";
import bimbingan1 from "../assets/images/bimbingan-1-800.webp";
import { Brand } from "../components/layout/brand";
import { buttonVariants } from "../components/ui/button-variants";

export function NotFoundPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-10">
      <div className="max-w-lg text-center">
        <div className="mb-6 flex justify-center">
          <Brand />
        </div>
        <img src={bimbingan1} alt="" className="mx-auto mb-6 h-28 w-28 rounded-full object-cover shadow-panel" />
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">404</p>
        <h1 className="mt-3 font-display text-h1 font-bold tracking-tight">Page not found</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The page you're looking for doesn't exist, or the link may be out of date. Let's get you back to your
          supervision work.
        </p>
        <Link to="/dashboard" className={buttonVariants({ className: "mt-6" })}>
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}
