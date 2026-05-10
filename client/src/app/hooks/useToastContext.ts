import { useContext } from "react";
import { ToastContext } from "../providers/ToastProvider";

export const useToastContext = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};