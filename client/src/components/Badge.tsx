import React from "react";

type BadgeVariant =
  | "default"
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "ghost"
  | "info"
  | "success"
  | "warning"
  | "error";

type BadgeSize = "xs" | "sm" | "md" | "lg";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  outline?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantMap: Record<BadgeVariant, string> = {
  default: "",
  neutral: "badge-neutral",
  primary: "badge-primary",
  secondary: "badge-secondary",
  accent: "badge-accent",
  ghost: "badge-ghost",
  info: "badge-info",
  success: "badge-success",
  warning: "badge-warning",
  error: "badge-error",
};

const sizeMap: Record<BadgeSize, string> = {
  xs: "badge-xs",
  sm: "badge-sm",
  md: "",
  lg: "badge-lg",
};

const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  size = "md",
  outline = false,
  children,
  className = "",
}) => {
  const classes = [
    "badge",
    variantMap[variant],
    sizeMap[size],
    outline ? "badge-outline" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={classes}>{children}</span>;
};

export default Badge;
