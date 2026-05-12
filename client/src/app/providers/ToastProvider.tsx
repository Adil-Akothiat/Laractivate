import React, { createContext } from "react";
import { Alert, useToast } from "@/components";

export const ToastContext = createContext<ReturnType<typeof useToast> | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const toastState = useToast();

  return (
    <ToastContext.Provider value={toastState}>
      {children}

      {/* 🔥 Global Toast Renderer */}
      <div className="toast toast-top toast-end z-[99999]">
        {toastState.toasts.map((t) => (
          <Alert
            key={t.id}
            {...t}
            onClose={() => toastState.removeToast(t.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};