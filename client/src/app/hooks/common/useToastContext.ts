import { ToastContext } from "@/app/providers/ToastProvider";
import { useContext } from "react";

export const useToastContext = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};