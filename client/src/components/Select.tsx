import React from "react";

type SelectSize = "xs" | "sm" | "md" | "lg";
type SelectVariant =
  | "default"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  placeholder?: string;
  options: SelectOption[];
  selectSize?: SelectSize;
  variant?: SelectVariant;
  bordered?: boolean;
  wrapperClassName?: string;
}

const sizeMap: Record<SelectSize, string> = {
  xs: "select-xs",
  sm: "select-sm",
  md: "",
  lg: "select-lg",
};

const variantMap: Record<SelectVariant, string> = {
  default: "",
  primary: "select-primary",
  secondary: "select-secondary",
  accent: "select-accent",
  info: "select-info",
  success: "select-success",
  warning: "select-warning",
  error: "select-error",
};

const Select: React.FC<SelectProps> = ({
  label,
  helperText,
  errorText,
  placeholder,
  options,
  selectSize = "md",
  variant = "default",
  bordered = true,
  wrapperClassName = "",
  className = "",
  id,
  ...props
}) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
  const hasError = !!errorText;

  const selectClasses = [
    "select",
    "w-full",
    bordered ? "select-bordered" : "",
    sizeMap[selectSize],
    hasError ? "select-error" : variantMap[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`form-control w-full ${wrapperClassName}`}>
      {label && (
        <label className="label" htmlFor={selectId}>
          <span className="label-text font-medium">{label}</span>
        </label>
      )}
      <select id={selectId} className={selectClasses} {...props}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      {(helperText || errorText) && (
        <label className="label">
          <span
            className={`label-text-alt ${hasError ? "text-error" : "text-base-content/60"}`}
          >
            {errorText || helperText}
          </span>
        </label>
      )}
    </div>
  );
};

export default Select;
