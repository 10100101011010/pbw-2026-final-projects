import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-primary">{eyebrow}</p> : null}
        <h1 className="font-display text-h2 font-bold tracking-tight text-foreground md:text-h1">{title}</h1>
        {description ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function PageGrid({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("grid gap-4 lg:gap-5", className)}>{children}</div>;
}
