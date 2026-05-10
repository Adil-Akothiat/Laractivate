import React from "react";

type AlertVariant = "default" | "success" | "warning" | "error" | "info";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

const variantMap: Record<AlertVariant, string> = {
  default: "",
  info: "alert-info",
  success: "alert-success",
  warning: "alert-warning",
  error: "alert-error",
};

const defaultIconMap: Record<AlertVariant, React.ReactNode> = {
  default: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 stroke-current">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  info: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 stroke-current">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  success: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export const Alert: React.FC<AlertProps> = ({
  variant = "info",
  title,
  message,
  onClose,
  className = "",
  icon,
}) => {
  return (
    <div
      role="alert"
      className={`alert ${variantMap[variant]} ${className}`}
    >
      {icon ?? defaultIconMap[variant]}
      <div>
        {title && <h3 className="font-bold">{title}</h3>}
        <div className={title ? "text-xs" : ""}>{message}</div>
      </div>
      {onClose && (
        <button
          className="btn btn-sm btn-ghost ml-auto"
          onClick={onClose}
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  );
};

// ─── Toast Container + Hook ────────────────────────────────────────────────────

export interface ToastItem {
  id: string;
  variant: AlertVariant;
  message: string;
  title?: string;
  duration?: number;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
  position?: "top-start" | "top-center" | "top-end" | "bottom-start" | "bottom-center" | "bottom-end";
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
  position = "bottom-end",
}) => {
  return (
    <div className={`toast ${position} z-50`}>
      {toasts.map((t) => (
        <Alert
          key={t.id}
          variant={t.variant}
          title={t.title}
          message={t.message}
          onClose={() => onRemove(t.id)}
        />
      ))}
    </div>
  );
};
