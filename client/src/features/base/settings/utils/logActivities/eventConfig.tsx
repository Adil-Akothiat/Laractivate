import {
    Logs,
    LogIn,
    LogOut,
    ShieldCheck,
    ShieldOff,
    UserPen,
    KeyRound,
    MailSearch,
    ShieldAlert,
    RefreshCcwDot,
} from "lucide-react";
import type { EventConfigProps } from "../../types";


export function getEventConfig(event: string): EventConfigProps {
    const map: Record<string, EventConfigProps> = {
        "auth.login": {
            icon: <LogIn size={15} />,
            label: "Successful Login",
            iconBg: "bg-success/10",
            iconColor: "text-success",
            badge: "badge-success badge-soft",
        },
        "auth.logout": {
            icon: <LogOut size={15} />,
            label: "Logged Out",
            iconBg: "bg-base-300/60",
            iconColor: "text-base-content/50",
            badge: "badge-ghost badge-soft",
        },
        "auth.login_failed": {
            icon: <ShieldAlert size={15} />,
            label: "Failed Login",
            iconBg: "bg-error/10",
            iconColor: "text-error",
            badge: "badge-error badge-soft",
        },
        "auth.2fa_toggle": {
            icon: <ShieldCheck size={15} />,
            label: "2FA Toggled",
            iconBg: "bg-info/10",
            iconColor: "text-info",
            badge: "badge-info badge-soft",
        },
        "auth.2fa_disabled": {
            icon: <ShieldOff size={15} />,
            label: "2FA Disabled",
            iconBg: "bg-warning/10",
            iconColor: "text-warning",
            badge: "badge-warning badge-soft",
        },
        "auth.password_update": {
            icon: <KeyRound size={15} />,
            label: "Password Changed",
            iconBg: "bg-warning/10",
            iconColor: "text-warning",
            badge: "badge-warning badge-soft",
        },
        "auth.password_reset": {
            icon: <RefreshCcwDot size={15} />,
            label: "Password Reset",
            iconBg: "bg-warning/10",
            iconColor: "text-warning",
            badge: "badge-warning badge-soft",
        },
        "auth.password_reset_request": {
            icon: <MailSearch size={15} />,
            label: "Forgot Password",
            iconBg: "bg-base-300/60",
            iconColor: "text-base-content/50",
            badge: "badge-ghost badge-soft",
        },
        "profile.update": {
            icon: <UserPen size={15} />,
            label: "Profile Updated",
            iconBg: "bg-primary/10",
            iconColor: "text-primary",
            badge: "badge-primary badge-soft",
        },
    };

    return (
        map[event] ?? {
            icon: <Logs size={15} />,
            label: event
                .split(".")
                .map((p) =>
                    p
                        .split("_")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")
                )
                .join(" › "),
            iconBg: "bg-base-300/60",
            iconColor: "text-base-content/40",
            badge: "badge-ghost badge-soft",
        }
    );
}
