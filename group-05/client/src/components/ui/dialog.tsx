import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/utils";
import { Button } from "./button";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({ className, children, ...props }: ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay asChild>
        <motion.div
          className="fixed inset-0 z-50 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
        />
      </DialogPrimitive.Overlay>
      <DialogPrimitive.Content {...props} asChild>
        <motion.div
          className={cn(
            "fixed left-1/2 top-1/2 z-50 max-h-[88svh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-xl border bg-card p-6 text-card-foreground shadow-panel",
            className
          )}
          initial={{ opacity: 0, scale: 0.96, x: "-50%", y: "-46%" }}
          animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
          <DialogPrimitive.Close asChild>
            <Button type="button" variant="ghost" size="icon" className="absolute right-3 top-3" aria-label="Close dialog">
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </DialogPrimitive.Close>
        </motion.div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("mb-5 space-y-1.5 pr-8", className)} {...props} />;
}

export function DialogTitle({ className, ...props }: ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cn("font-display text-h4 font-semibold tracking-tight", className)} {...props} />;
}

export function DialogDescription({ className, ...props }: ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cn("text-sm leading-relaxed text-muted-foreground", className)} {...props} />;
}
