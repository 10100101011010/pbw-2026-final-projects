import { AlertCircle } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "../../lib/utils";

type FieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export function Field({ label, htmlFor, error, hint, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-semibold tracking-tight text-foreground">
        {label}
      </label>
      {children}
      {error ? (
        <p className="flex items-center gap-1.5 text-sm text-destructive">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
      {hint && !error ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

const controlBase =
  "w-full rounded-lg border bg-background text-sm text-foreground shadow-sm transition-colors duration-150 placeholder:text-muted-foreground hover:border-muted-foreground/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

export function Input({ className, ...props }: ComponentPropsWithoutRef<"input">) {
  return <input className={cn(controlBase, "h-10 px-3", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentPropsWithoutRef<"textarea">) {
  return <textarea className={cn(controlBase, "min-h-28 resize-y px-3 py-2 leading-relaxed", className)} {...props} />;
}

export function Select({ className, ...props }: ComponentPropsWithoutRef<"select">) {
  return <select className={cn(controlBase, "h-10 px-3", className)} {...props} />;
}
