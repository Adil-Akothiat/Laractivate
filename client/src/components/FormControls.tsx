import React from "react";

// ─── Toggle ───────────────────────────────────────────────────────────────────

type ControlVariant =
  | "default"
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "error"
  | "info";

interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  variant?: ControlVariant;
  inputSize?: "xs" | "sm" | "md" | "lg";
  labelPosition?: "left" | "right";
}

const variantToggle: Record<ControlVariant, string> = {
  default: "",
  primary: "toggle-primary",
  secondary: "toggle-secondary",
  accent: "toggle-accent",
  success: "toggle-success",
  warning: "toggle-warning",
  error: "toggle-error",
  info: "toggle-info",
};

const sizeToggle = { xs: "toggle-xs", sm: "toggle-sm", md: "", lg: "toggle-lg" };

export const Toggle: React.FC<ToggleProps> = ({
  label,
  variant = "default",
  inputSize = "md",
  labelPosition = "right",
  className = "",
  ...props
}) => (
  <label className="flex items-center gap-2 cursor-pointer w-fit">
    {label && labelPosition === "left" && (
      <span className="label-text">{label}</span>
    )}
    <input
      type="checkbox"
      className={`toggle ${variantToggle[variant]} ${sizeToggle[inputSize]} ${className}`}
      {...props}
    />
    {label && labelPosition === "right" && (
      <span className="label-text">{label}</span>
    )}
  </label>
);

// ─── Checkbox ─────────────────────────────────────────────────────────────────

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  variant?: ControlVariant;
  inputSize?: "xs" | "sm" | "md" | "lg";
}

const variantCheckbox: Record<ControlVariant, string> = {
  default: "",
  primary: "checkbox-primary",
  secondary: "checkbox-secondary",
  accent: "checkbox-accent",
  success: "checkbox-success",
  warning: "checkbox-warning",
  error: "checkbox-error",
  info: "checkbox-info",
};

const sizeCheckbox = { xs: "checkbox-xs", sm: "checkbox-sm", md: "", lg: "checkbox-lg" };
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  variant = "default",
  inputSize = "md",
  className = "",
  ...props
}, ref) => (
  <label className="flex items-center gap-2 cursor-pointer w-fit">
    <input
      ref={ref}
      type="checkbox"
      className={`checkbox ${variantCheckbox[variant]} ${sizeCheckbox[inputSize]} ${className}`}
      {...props}
    />
    {label && <span className="label-text">{label}</span>}
  </label>
));

Checkbox.displayName = "Checkbox";
// ─── Radio ────────────────────────────────────────────────────────────────────

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  variant?: ControlVariant;
  inputSize?: "xs" | "sm" | "md" | "lg";
}

const variantRadio: Record<ControlVariant, string> = {
  default: "",
  primary: "radio-primary",
  secondary: "radio-secondary",
  accent: "radio-accent",
  success: "radio-success",
  warning: "radio-warning",
  error: "radio-error",
  info: "radio-info",
};

const sizeRadio = { xs: "radio-xs", sm: "radio-sm", md: "", lg: "radio-lg" };

export const Radio: React.FC<RadioProps> = ({
  label,
  variant = "default",
  inputSize = "md",
  className = "",
  ...props
}) => (
  <label className="flex items-center gap-2 cursor-pointer w-fit">
    <input
      type="radio"
      className={`radio ${variantRadio[variant]} ${sizeRadio[inputSize]} ${className}`}
      {...props}
    />
    {label && <span className="label-text">{label}</span>}
  </label>
);


export const FormControl = ({children, className}:{children: React.ReactNode; className?: string}) => (
  <div className={`form-control ${className}`}>{children}</div>
)