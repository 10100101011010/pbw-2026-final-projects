import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export function Loading({ label = "Loading", className }: { label?: string; className?: string }) {
  return (
    <div className={cn("flex min-h-40 items-center justify-center gap-3 text-sm text-muted-foreground", className)}>
      <Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
