import type { ComponentPropsWithoutRef } from "react";
import { cn, getInitials } from "../../lib/utils";

type AvatarProps = ComponentPropsWithoutRef<"div"> & {
  name?: string | null;
  imageUrl?: string | null;
};

export function Avatar({ name, imageUrl, className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "inline-flex h-10 w-10 shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-semibold tracking-tight text-primary ring-1 ring-border",
        className
      )}
      {...props}
    >
      {imageUrl ? <img src={imageUrl} alt="" className="h-full w-full object-cover" /> : getInitials(name)}
    </div>
  );
}
