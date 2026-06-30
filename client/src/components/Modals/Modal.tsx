import React, { useEffect, useRef } from "react";
import Button from "../Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  isConfirming?: boolean;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-3xl",
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isConfirming = false,
  footer,
  size = "md",
  closeOnBackdrop = true,
  showCloseButton = true,
  className = "",
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (closeOnBackdrop && e.target === dialogRef.current) {
      onClose();
    }
  };
  const resolvedFooter = footer ?? (
    onConfirm ? (
      <div className="flex gap-2 justify-end w-full">
        <Button
          size="sm"
          variant='default'
          onClick={onClose}
          disabled={isConfirming}
        >
          {cancelText}
        </Button>
        <Button
          size="sm"
          variant='error'
          outline={true}
          onClick={onConfirm}
          loading={isConfirming}
          loadingText={confirmText+'...'}
        >
          {confirmText}
        </Button>
      </div>
    ) : null
  );

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      onClick={handleBackdropClick}
    >
      <div className={`modal-box max-h-11/12 ${sizeMap[size]} ${className}`}>
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between mb-4">
            {title && <h3 className="font-bold text-lg">{title}</h3>}
            {showCloseButton && (
              <Button
                size='sm'
                variant="ghost"
                onClick={onClose}
                disabled={isConfirming}
                aria-label="Close"
                className="btn-circle"
              >
                ✕
              </Button>
            )}
          </div>
        )}

        <div>{children}</div>
        {resolvedFooter && (
          <div className="modal-action mt-4">{resolvedFooter}</div>
        )}
      </div>
    </dialog>
  );
};

export default Modal;