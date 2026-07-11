import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-tight", {
  variants: {
    variant: {
      default: "border-transparent bg-secondary text-secondary-foreground",
      primary: "border-transparent bg-primary text-primary-foreground",
      success: "border-transparent bg-success text-success-foreground",
      warning: "border-transparent bg-warning text-warning-foreground",
      destructive: "border-transparent bg-destructive text-destructive-foreground",
      outline: "bg-background text-foreground"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

type BadgeProps = ComponentPropsWithoutRef<"span"> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
