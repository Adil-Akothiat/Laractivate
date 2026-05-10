import type { ActivityLogProps, User } from "../../settings";

export type ViewType = "personal" | "system";

export type SystemHealthItem = {
    label: string;
    value: string;
    status: "success" | "warning" | "error";
};

export type CompositionItem = {
    name: string;
    value: number;
    color: string;
};

export type QuickAction = {
    label: string;
    icon: string;
    action: string;
    variant: "primary" | "outline" | "ghost";
};

export type SecurityDetail = {
    label: string;
    enabled: boolean;
};

export type StatItem = {
    value: string | number;
    label: string;
    icon: string;
    color?: "success" | "warning" | "error" | "info" | "primary";
    security_details?: SecurityDetail[];
};

export type AuthMeta = {
    refresh_expires_in: string;
    access_expires_in: string;
};

export type PersonalDashboardData = {
    view_type: "personal";
    user: User;
    stats: Record<string, StatItem>;
    recent_activity: ActivityLogProps[];
    auth_meta: AuthMeta;
};

export type SystemDashboardData = {
    view_type: "system";
    user: User;
    stats: Record<string, StatItem>;
    charts: {
        user_growth: { date: string; count: number }[];
        composition: CompositionItem[];
    };
    system_health: Record<string, SystemHealthItem>;
    quick_actions: QuickAction[];
    recent_activity: ActivityLogProps[];
    auth_meta: AuthMeta;

};

export type DashboardData = PersonalDashboardData | SystemDashboardData;