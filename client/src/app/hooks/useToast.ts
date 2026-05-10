import { useState, useCallback } from "react";
import type { ToastItem } from "../../components/Alert";

type ToastVariant = "info" | "success" | "warning" | "error";

interface ShowToastOptions {
  title?: string;
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (
      message: string,
      variant: ToastVariant = "info",
      options: ShowToastOptions = {}
    ) => {
      const id = Math.random().toString(36).slice(2);
      const duration = options.duration ?? 4000;

      const newToast: ToastItem = {
        id,
        message,
        variant,
        title: options.title,
        duration,
      };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }

      return id;
    },
    [removeToast]
  );

  const toast = {
    info: (msg: string, opts?: ShowToastOptions) =>
      showToast(msg, "info", opts),
    success: (msg: string, opts?: ShowToastOptions) =>
      showToast(msg, "success", opts),
    warning: (msg: string, opts?: ShowToastOptions) =>
      showToast(msg, "warning", opts),
    error: (msg: string, opts?: ShowToastOptions) =>
      showToast(msg, "error", opts),
  };

  return { toasts, removeToast, toast };
}
