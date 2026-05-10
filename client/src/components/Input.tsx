import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type InputSize = "xs" | "sm" | "md" | "lg";
type InputVariant =
  | "default"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  inputSize?: InputSize;
  variant?: InputVariant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  bordered?: boolean;
  ghost?: boolean;
  wrapperClassName?: string;
}

const sizeMap: Record<InputSize, string> = {
  xs: "input-xs",
  sm: "input-sm",
  md: "",
  lg: "input-lg",
};

const variantMap: Record<InputVariant, string> = {
  default: "",
  primary: "input-primary",
  secondary: "input-secondary",
  accent: "input-accent",
  info: "input-info",
  success: "input-success",
  warning: "input-warning",
  error: "input-error",
};

const Input: React.FC<InputProps> = ({
  label,
  helperText,
  errorText,
  inputSize = "md",
  variant = "default",
  leftIcon,
  rightIcon,
  bordered = true,
  ghost = false,
  wrapperClassName = "",
  className = "",
  id,
  type,
  ...props
}) => {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  const inputId    = id || label?.toLowerCase().replace(/\s+/g, "-");
  const hasError   = !!errorText;
  // const hasRightSlot = !!rightIcon || isPassword;
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  const wrapperClasses = [
    "input",
    "w-full",
    "flex items-center gap-2",
    bordered ? "input-bordered" : "",
    ghost    ? "input-ghost"    : "",
    sizeMap[inputSize],
    hasError ? "input-error" : variantMap[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`form-control w-full ${wrapperClassName}`}>
      {label && (
        <label className="label" htmlFor={inputId}>
          <span className="label-text font-medium">{label}</span>
        </label>
      )}

      {/* ← label is the input wrapper in DaisyUI v5 */}
      <label htmlFor={inputId} className={wrapperClasses}>
        {leftIcon && (
          <span className="text-base-content/50 shrink-0">{leftIcon}</span>
        )}

        <input
          id={inputId}
          type={resolvedType}
          className="grow bg-transparent outline-none min-w-0"
          {...props}
        />

        {isPassword ? (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="text-base-content/50 hover:text-base-content transition-colors shrink-0"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        ) : (
          rightIcon && (
            <span className="text-base-content/50 shrink-0">{rightIcon}</span>
          )
        )}
      </label>

      {(helperText || errorText) && (
        <label className="label">
          <span className={`label-text-alt ${hasError ? "text-error" : "text-base-content/60"}`}>
            {errorText || helperText}
          </span>
        </label>
      )}
    </div>
  );
};

export default Input;