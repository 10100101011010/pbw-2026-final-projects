import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/utils";

export function Table({ className, ...props }: ComponentPropsWithoutRef<"table">) {
  return <table className={cn("w-full caption-bottom text-sm", className)} {...props} />;
}

export function TableHeader({ className, ...props }: ComponentPropsWithoutRef<"thead">) {
  return <thead className={cn("border-b bg-muted/50", className)} {...props} />;
}

export function TableBody({ className, ...props }: ComponentPropsWithoutRef<"tbody">) {
  return <tbody className={cn("divide-y", className)} {...props} />;
}

export function TableRow({ className, ...props }: ComponentPropsWithoutRef<"tr">) {
  return <tr className={cn("transition-colors duration-150 hover:bg-muted/30", className)} {...props} />;
}

export function TableHead({ className, ...props }: ComponentPropsWithoutRef<"th">) {
  return (
    <th
      className={cn(
        "h-11 px-4 text-left align-middle text-xs font-bold uppercase tracking-wide text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: ComponentPropsWithoutRef<"td">) {
  return <td className={cn("px-4 py-3 align-middle", className)} {...props} />;
}
