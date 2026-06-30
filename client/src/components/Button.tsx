import React from "react";

type ButtonVariant =
    | "default"
    | "primary"
    | "secondary"
    | "accent"
    | "ghost"
    | "link"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "neutral";

type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    outline?: boolean;
    loading?: boolean;
    loadingText?: string;
    wide?: boolean;
    block?: boolean;
    circle?: boolean;
    square?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children?: React.ReactNode;
}

const sizeMap: Record<ButtonSize, string> = {
    xs: "btn-xs",
    sm: "btn-sm",
    md: "",
    lg: "btn-lg",
};

const variantMap: Record<ButtonVariant, string> = {
    default: "",
    primary: "btn-primary",
    secondary: "btn-secondary",
    accent: "btn-accent",
    ghost: "btn-ghost",
    link: "btn-link",
    info: "btn-info",
    success: "btn-success",
    warning: "btn-warning",
    error: "btn-error",
    neutral: "btn-neutral",
};
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = "primary",
            size = "md",
            outline = false,
            loading = false,
            loadingText = "",
            wide = false,
            block = false,
            circle = false,
            square = false,
            leftIcon,
            rightIcon,
            children,
            className = "",
            disabled,
            ...props
        },
        ref,
    ) => {
        const classes = [
            "btn",
            variantMap[variant],
            sizeMap[size],
            outline ? "btn-outline" : "",
            wide ? "btn-wide" : "",
            block ? "btn-block" : "",
            circle ? "btn-circle" : "",
            square ? "btn-square" : "",
            className,
        ]
            .filter(Boolean)
            .join(" ");

        const isIconOnly = (circle || square) && !children;

        return (
            <button
                ref={ref}
                className={classes}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <>
                        <span className="loading loading-spinner loading-sm" />
                        <span>{loadingText}</span>
                    </>
                ) : isIconOnly ? (
                    (leftIcon ?? rightIcon) // render bare, no span wrapper
                ) : (
                    <>
                        {leftIcon && <span className="mr-1">{leftIcon}</span>}
                        {children}
                        {rightIcon && <span className="ml-1">{rightIcon}</span>}
                    </>
                )}
            </button>
        );
    },
);

Button.displayName = "Button";

export default Button;