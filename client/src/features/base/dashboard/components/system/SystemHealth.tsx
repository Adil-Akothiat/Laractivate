import { CheckCircle2, AlertTriangle, XCircle, Server } from "lucide-react";
import type { SystemHealthItem } from "../../types";
// import { Badge } from "../../../../components";

const statusConfig = {
    success: {
        icon: <CheckCircle2 size={15} className="text-success" />,
        badge: "badge-success",
        ring: "ring-success/20",
    },
    warning: {
        icon: <AlertTriangle size={15} className="text-warning" />,
        badge: "badge-warning",
        ring: "ring-warning/20",
    },
    error: {
        icon: <XCircle size={15} className="text-error" />,
        badge: "badge-error",
        ring: "ring-error/20",
    },
};

type Props = {
    health: Record<string, SystemHealthItem>;
};

export function SystemHealth({ health }: Props) {
    // const allHealthy = Object.values(health).every((h) => h.status === "success");

    return (
        <div className="rounded-2xl border border-base-300 bg-base-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-base-300">
                <div className="flex items-center gap-2">
                    <Server size={16} className="text-primary" />
                    <h2 className="font-semibold text-sm">System Health</h2>
                </div>
                {/* <Badge
                    variant={allHealthy ? 'success' : 'warning'}
                    size="sm"
                    outline={true}
                >
                    {
                        allHealthy ? "All systems operational" : "Needs attention"
                    }
                </Badge> */}
            </div>

            {/* Items */}
            <div className="divide-y divide-base-200">
                {Object.entries(health).map(([key, item]) => {
                    const s = statusConfig[item.status] ?? statusConfig.success;
                    return (
                        <div key={key} className="flex items-center justify-between px-6 py-3.5 hover:bg-base-200/40 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center ring-1 ${s.ring}`}>
                                    {s.icon}
                                </div>
                                <span className="text-sm text-base-content/70 font-medium">
                                    {item.label}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-mono text-base-content/60">
                                    {item.value}
                                </span>
                                <span className={`badge badge-xs ${s.badge}`}>
                                    {item.status}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}