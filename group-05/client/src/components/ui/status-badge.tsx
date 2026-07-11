import { Badge } from "./badge";
import { cn, titleCase } from "../../lib/utils";

type StatusBadgeProps = {
  status?: string | null;
};

const dotToneClass: Record<string, string> = {
  success: "bg-success-foreground",
  warning: "bg-warning-foreground",
  destructive: "bg-destructive-foreground",
  default: "bg-secondary-foreground"
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status?.toUpperCase() ?? "UNKNOWN";
  const variant =
    normalized === "ELIGIBLE" || normalized.includes("APPROVED") || normalized.includes("AVAILABLE") || normalized === "OPEN"
      ? "success"
      : normalized.includes("PENDING") || normalized.includes("INCOMPLETE") || normalized.includes("UPLOADED")
        ? "warning"
        : normalized.includes("REJECTED") || normalized.includes("CANCELLED") || normalized.includes("NOT_ELIGIBLE")
          ? "destructive"
          : "default";

  return (
    <Badge variant={variant}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dotToneClass[variant])} aria-hidden="true" />
      {titleCase(normalized)}
    </Badge>
  );
}
