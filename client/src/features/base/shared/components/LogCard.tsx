import { useState } from "react";
import { Globe, Monitor, ChevronDown } from "lucide-react";
import { getEventConfig } from "../utils/logs/eventConfig";
import { fullDate, parseDevice, relativeTime } from "../utils/logs/helpers";
import ProfileDiff from "../../settings/components/ActivityLogs/ProfileDiff";
import type { LogSchema } from "../types";

export default function LogCard({ log }: { log: LogSchema }) {
    const [open, setOpen] = useState(false);
    
    const config = getEventConfig(log.event);
    const device = parseDevice(log.properties);
    const isLocal =
        !log.properties?.city ||
        log.properties.city === "Local" ||
        log.properties.country === "Localhost";

    return (
        <div className="rounded-2xl border border-base-200 bg-base-100 transition-colors hover:border-base-300">
            {/* ── Summary row (always visible) ── */}
            <button
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center gap-3.5 p-4 text-left"
            >
                {/* Icon */}
                <div
                    className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center ${config.iconBg} ${config.iconColor}`}
                >
                    {config.icon}
                </div>

                {/* Title + badge */}
                <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-sm font-semibold text-base-content leading-snug">
                        {log.description}
                    </p>
                    <span className={`badge badge-xs ${config.badge}`}>
                        {config.label}
                    </span>
                </div>

                {/* Date + chevron */}
                <div className="flex items-center gap-2 shrink-0">
                    <time
                        title={fullDate(log.created_at)}
                        className="text-xs text-base-content/35 whitespace-nowrap"
                    >
                        {relativeTime(log.created_at)}
                    </time>
                    <ChevronDown
                        size={14}
                        className={`text-base-content/30 transition-transform duration-200 ${
                            open ? "rotate-180" : ""
                        }`}
                    />
                </div>
            </button>

            {/* ── Expanded details ── */}
            {open && (
                <div className="px-4 pb-4 space-y-3 border-t border-base-200 pt-3">
                    {/* Profile diff */}
                    {log.event === "profile.update" && (
                        <ProfileDiff properties={log.properties} />
                    )}
                    {/* Meta row */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-base-content/40">
                        <span className="flex items-center gap-1">
                            <Globe size={11} />
                            {log.ip_address}
                            {!isLocal && log.properties?.city && (
                                <span className="text-base-content/25">
                                    · {log.properties.city}, {log.properties.country}
                                </span>
                            )}
                        </span>
                        {device && (
                            <span className="flex items-center gap-1">
                                <Monitor size={11} />
                                {device}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}