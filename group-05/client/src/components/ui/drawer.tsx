import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/utils";
import { Button } from "./button";

export const Drawer = DialogPrimitive.Root;
export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerClose = DialogPrimitive.Close;

type DrawerContentProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  side?: "left" | "right";
};

export function DrawerContent({ className, side = "right", children, ...props }: DrawerContentProps) {
  const shouldReduceMotion = useReducedMotion();
  const offscreenX = side === "right" ? "100%" : "-100%";

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay asChild>
        <motion.div
          className="fixed inset-0 z-50 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
        />
      </DialogPrimitive.Overlay>
      <DialogPrimitive.Content {...props} asChild>
        <motion.div
          className={cn(
            "fixed top-0 z-50 h-svh w-[min(88vw,24rem)] overflow-y-auto border bg-card p-5 text-card-foreground shadow-panel",
            side === "right" ? "right-0 border-l" : "left-0 border-r",
            className
          )}
          initial={{ x: offscreenX }}
          animate={{ x: "0%" }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
          <DialogPrimitive.Close asChild>
            <Button type="button" variant="ghost" size="icon" className="absolute right-3 top-3" aria-label="Close drawer">
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </DialogPrimitive.Close>
        </motion.div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export const DrawerTitle = DialogPrimitive.Title;
export const DrawerDescription = DialogPrimitive.Description;
