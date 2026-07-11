import { createContext, useContext } from "react";

export type ToastVariant = "default" | "success" | "destructive";

export type ToastMessage = {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
};

export type ToastContextValue = {
  notify: (message: Omit<ToastMessage, "id">) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToast must be used inside ToastProvider.");
  return value;
};
