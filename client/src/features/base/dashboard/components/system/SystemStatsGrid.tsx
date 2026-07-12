import {
    Users, Monitor, ShieldCheck, Bell, TrendingUp
} from "lucide-react";
import type { StatItem } from "@/features/base/dashboard/types";

const iconMap: Record<string, React.ReactNode> = {
    users:          <Users size={18} />,
    monitor:        <Monitor size={18} />,
    "shield-check": <ShieldCheck size={18} />,
    bell:           <Bell size={18} />,
};

const iconStyle: Record<string, { icon: string; value: string; ring: string }> = {
    users:          { icon: "bg-blue-500/10 text-blue-500",       value: "text-blue-500",    ring: "ring-blue-500/20"    },
    monitor:        { icon: "bg-emerald-500/10 text-emerald-500", value: "text-emerald-500", ring: "ring-emerald-500/20" },
    "shield-check": { icon: "bg-violet-500/10 text-violet-500",   value: "text-violet-500",  ring: "ring-violet-500/20"  },
    bell:           { icon: "bg-amber-500/10 text-amber-500",     value: "text-amber-500",   ring: "ring-amber-500/20"   },
};

type Props = {
    stats: Record<string, StatItem>;
};

export function SystemStatsGrid({ stats }: Props) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(stats).map(([key, stat]) => {
                const s = iconStyle[stat.icon] ?? iconStyle["bell"];
                return (
                    <div
                        key={key}
                        className={`rounded-2xl border bg-base-100 p-5 flex flex-col gap-4 hover:shadow-md transition-all duration-200 ring-1 ${s.ring} border-transparent`}
                    >
                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.icon}`}>
                            {iconMap[stat.icon] ?? <TrendingUp size={18} />}
                        </span>
                        <div>
                            <p className="text-xs text-base-content/50 font-medium">{stat.label}</p>
                            <p className={`text-3xl font-bold tabular-nums mt-0.5 ${s.value}`}>{stat.value}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}