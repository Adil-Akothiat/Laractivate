import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { ReactNode } from "react";

export const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "success" | "info" | "error" | "ghost"; icon: ReactNode }
> = {
  active: { label: "Active", variant: "success", icon: <CheckCircle2 size={12} /> },
  trialing: { label: "Trial", variant: "info", icon: <Clock size={12} /> },
  past_due: { label: "Past Due", variant: "error", icon: <XCircle size={12} /> },
  canceled: { label: "Canceled", variant: "ghost", icon: <XCircle size={12} /> },
  inactive: { label: "Inactive", variant: "ghost", icon: <XCircle size={12} /> },
};