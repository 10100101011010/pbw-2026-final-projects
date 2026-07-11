import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/utils";

export function Card({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("surface rounded-xl transition-shadow duration-200", className)} {...props} />;
}

export function CardHeader({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("flex flex-col gap-1.5 p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentPropsWithoutRef<"h2">) {
  return (
    <h2 className={cn("font-display text-h4 font-semibold leading-tight tracking-tight text-foreground", className)} {...props} />
  );
}

export function CardDescription({ className, ...props }: ComponentPropsWithoutRef<"p">) {
  return <p className={cn("text-sm leading-relaxed text-muted-foreground", className)} {...props} />;
}

export function CardContent({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("flex items-center gap-3 p-6 pt-0", className)} {...props} />;
}
