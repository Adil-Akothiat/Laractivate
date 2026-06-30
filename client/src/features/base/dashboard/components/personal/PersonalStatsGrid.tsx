import {
    ShieldCheck, ShieldAlert,
    Bell, Smartphone, TrendingUp,
    CheckCircle2, XCircle
} from "lucide-react";
import type { StatItem } from "@/features/base/dashboard/types";

const iconMap: Record<string, React.ReactNode> = {
    "shield-check": <ShieldCheck size={18} />,
    "shield-alert": <ShieldAlert size={18} />,
    bell:           <Bell size={18} />,
    smartphone:     <Smartphone size={18} />,
};

const semanticStyle: Record<string, { icon: string; value: string; ring: string }> = {
    success: { icon: "bg-success/10 text-success", value: "text-success", ring: "ring-success/20" },
    warning: { icon: "bg-warning/10 text-warning", value: "text-warning", ring: "ring-warning/20" },
    error:   { icon: "bg-error/10 text-error",     value: "text-error",   ring: "ring-error/20"   },
    info:    { icon: "bg-info/10 text-info",       value: "text-info",    ring: "ring-info/20"    },
};

const iconStyle: Record<string, { icon: string; value: string; ring: string }> = {
    "shield-check": { icon: "bg-violet-500/10 text-violet-500", value: "text-violet-500", ring: "ring-violet-500/20" },
    "shield-alert": { icon: "bg-warning/10 text-warning",       value: "text-warning",    ring: "ring-warning/20"   },
    bell:           { icon: "bg-amber-500/10 text-amber-500",   value: "text-amber-500",  ring: "ring-amber-500/20" },
    smartphone:     { icon: "bg-cyan-500/10 text-cyan-500",     value: "text-cyan-500",   ring: "ring-cyan-500/20"  },
};

function resolveStyle(stat: StatItem) {
    if (stat.color && semanticStyle[stat.color]) return semanticStyle[stat.color];
    return iconStyle[stat.icon] ?? iconStyle["bell"];
}

type Props = {
    stats: Record<string, StatItem>;
};

export function PersonalStatsGrid({ stats }: Props) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 items-start">
            {Object.entries(stats).map(([key, stat]) => {
                const s = resolveStyle(stat);
                const hasDetails = stat.security_details && stat.security_details.length > 0;

                return (
                    <div
                        key={key}
                        className={`rounded-2xl border bg-base-100 p-5 flex flex-col gap-4 hover:shadow-md transition-all duration-200 ring-1 ${s.ring} border-transparent h-full`}
                    >
                        {hasDetails ? (
                            <>
                                <div className="flex items-center justify-between">
                                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.icon}`}>
                                        {iconMap[stat.icon] ?? <TrendingUp size={18} />}
                                    </span>
                                    <span className={`text-2xl font-bold tabular-nums ${s.value}`}>
                                        {stat.value}
                                    </span>
                                </div>
                                <p className="text-xs text-base-content/50 font-medium -mt-2">{stat.label}</p>
                                <div className="flex flex-col gap-2 pt-2 border-t border-base-200">
                                    {stat.security_details!.map((detail) => (
                                        <div key={detail.label} className="flex items-center justify-between gap-2">
                                            <span className="text-[11px] text-base-content/50 font-medium">
                                                {detail.label}
                                            </span>
                                            {detail.enabled
                                                ? <CheckCircle2 size={14} className="text-success shrink-0" />
                                                : <XCircle size={14} className="text-error shrink-0" />
                                            }
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.icon}`}>
                                    {iconMap[stat.icon] ?? <TrendingUp size={18} />}
                                </span>
                                <div>
                                    <p className="text-xs text-base-content/50 font-medium">{stat.label}</p>
                                    <p className={`text-3xl font-bold tabular-nums mt-0.5 ${s.value}`}>{stat.value}</p>
                                </div>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
}