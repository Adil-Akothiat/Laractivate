import { Button } from "@/components";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { SessionCardProps } from "../model/session.types";
import { DeviceIcon } from "./DeviceIcon";
import { SessionMeta } from "./SessionMeta";
import { SessionRow } from "./SessionRow";

export function SessionCard({
    session,
    active = false,
    badge,
    action
}: SessionCardProps) {
    const [expanded, setExpanded] = useState(false);
    const browserLabel = session.browser_version
        ? `${session.browser} ${session.browser_version}`
        : session.browser;

    const platformLabel = session.platform_version
        ? `${session.platform} ${session.platform_version}`
        : session.platform;

    return (
        <li
            className={[
                "rounded-2xl border p-4 flex flex-col gap-3 transition-colors",
                active && session.is_current
                    ? "border-primary/30 bg-primary/5"
                    : "border-base-300 bg-base-100",
            ].join(" ")}
        >
            {/* Top row */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                    <DeviceIcon device={session.device} active={active} />
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span
                                className={`font-medium text-sm ${active ? "text-base-content" : "text-base-content/60"}`}
                            >
                                {browserLabel}
                            </span>
                            {badge}
                        </div>
                        <p className="text-xs text-base-content/50">
                            {platformLabel}
                        </p>
                        <SessionMeta session={session} />
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    {!session.is_current && action}
                    <Button
                        variant="ghost"
                        size="xs"
                        circle
                        onClick={() => setExpanded((v) => !v)}
                        title="Show details"
                    >
                        {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </Button>
                </div>
            </div>

            {/* Expanded details */}
            {expanded && (
                <div className="rounded-xl bg-base-200/60 px-3 py-2.5 space-y-1.5 text-xs text-base-content/50">
                    {session.device_name && (
                        <SessionRow label="Device" value={session.device_name} />
                    )}
                    {session.browser_version && (
                        <SessionRow label="Browser version" value={session.browser_version} />
                    )}
                    {session.platform_version && (
                        <SessionRow label="OS version" value={session.platform_version} />
                    )}
                    {session.timezone && (
                        <SessionRow label="Timezone" value={session.timezone} />
                    )}
                    {session.user_agent && (
                        <div className="pt-1 border-t border-base-300">
                            <p className="text-base-content/30 mb-1">User agent</p>
                            <p className="font-mono text-[10px] leading-relaxed break-all text-base-content/40">
                                {session.user_agent}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </li>
    );
}