import React from "react";
import Modal from "./Modal";
import Button from "../Button";

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "error" | "warning" | "info" | "success";
  loading?: boolean;
}

const variantIcon: Record<string, React.ReactNode> = {
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-error mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  ),
  warning: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-warning mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  ),
  info: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-info mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  success: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-success mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const confirmVariantMap = {
  error: "error" as const,
  warning: "warning" as const,
  info: "primary" as const,
  success: "success" as const,
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "warning",
  loading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      size="sm"
      showCloseButton={false}
      footer={
        <div className="flex gap-2 w-full justify-end">
          <Button 
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariantMap[variant]}
            size="sm"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <div className="text-center space-y-3">
        {variantIcon[variant]}
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-base-content/70">{message}</p>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
