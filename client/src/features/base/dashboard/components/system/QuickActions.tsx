import {
    UserPlus, RefreshCw, Settings,
    Zap, ChevronRight, type LucideIcon
} from "lucide-react";
import type { QuickAction } from "@/features/base/dashboard/types";

const iconMap: Record<string, LucideIcon> = {
    "user-plus":  UserPlus,
    "refresh-cw": RefreshCw,
    settings:     Settings,
};

const variantStyle: Record<QuickAction["variant"], { row: string; icon: string }> = {
    primary: {
        row:  "bg-primary/5 hover:bg-primary/10 border-primary/20",
        icon: "bg-primary/10 text-primary",
    },
    outline: {
        row:  "bg-base-200/40 hover:bg-base-200/80 border-base-300",
        icon: "bg-base-200 text-base-content/60",
    },
    ghost: {
        row:  "bg-transparent hover:bg-base-200/60 border-transparent",
        icon: "bg-base-200 text-base-content/60",
    },
};

const isApiAction = (action: string) => action.startsWith("api/");

type Props = {
    actions: QuickAction[];
};

export function QuickActions({ actions }: Props) {
    const handleAction = async (action: QuickAction) => {
        if (isApiAction(action.action)) {
            try {
                await fetch(`/${action.action}`, { method: "POST", credentials: "include" });
            } catch (e) {
                console.error("Action failed", e);
            }
        } else {
            window.location.href = action.action;
        }
    };

    return (
        <div className="rounded-2xl border border-base-300 bg-base-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 px-6 py-4 border-b border-base-300">
                <Zap size={16} className="text-primary" />
                <h2 className="font-semibold text-sm">Quick Actions</h2>
            </div>

            {/* Action list */}
            <div className="p-4 flex flex-col gap-2">
                {actions.map((action) => {
                    const Icon = iconMap[action.icon] ?? Zap;
                    const s = variantStyle[action.variant];
                    return (
                        <button
                            key={action.label}
                            onClick={() => handleAction(action)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors duration-150 w-full text-left ${s.row}`}
                        >
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${s.icon}`}>
                                <Icon size={15} />
                            </span>
                            <span className="flex-1 text-sm font-medium text-base-content">
                                {action.label}
                            </span>
                            <ChevronRight size={15} className="text-base-content/30 shrink-0" />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}