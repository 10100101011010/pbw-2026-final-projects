import * as ToastPrimitive from "@radix-ui/react-toast";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { ToastContext, type ToastMessage } from "./toast-context";

const toastIcon = {
  default: Info,
  success: CheckCircle2,
  destructive: XCircle
} as const;

const toastIconClass = {
  default: "text-muted-foreground",
  success: "text-success",
  destructive: "text-destructive"
} as const;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  const shouldReduceMotion = useReducedMotion();

  const notify = useCallback((message: Omit<ToastMessage, "id">) => {
    setMessages((current) => [...current, { ...message, id: crypto.randomUUID() }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setMessages((current) => current.filter((item) => item.id !== id));
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        <AnimatePresence initial={false}>
          {messages.map((message) => {
            const tone = message.variant ?? "default";
            const Icon = toastIcon[tone];
            return (
              <ToastPrimitive.Root
                key={message.id}
                asChild
                onOpenChange={(open) => {
                  if (!open) dismiss(message.id);
                }}
              >
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "relative flex w-[min(92vw,24rem)] gap-3 rounded-xl border bg-card p-4 text-card-foreground shadow-panel",
                    tone === "success" && "border-success/30",
                    tone === "destructive" && "border-destructive/30"
                  )}
                >
                  <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", toastIconClass[tone])} aria-hidden="true" />
                  <div className="grid gap-1 pr-6">
                    <ToastPrimitive.Title className="text-sm font-bold">{message.title}</ToastPrimitive.Title>
                    {message.description ? (
                      <ToastPrimitive.Description className="text-sm leading-relaxed text-muted-foreground">
                        {message.description}
                      </ToastPrimitive.Description>
                    ) : null}
                  </div>
                  <ToastPrimitive.Close asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-8 w-8"
                      aria-label="Dismiss"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </ToastPrimitive.Close>
                </motion.div>
              </ToastPrimitive.Root>
            );
          })}
        </AnimatePresence>
        <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-[100] flex max-w-full flex-col gap-3" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}
