import { Activity, Clock, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { ActivityLogProps } from "../../../settings";

const eventStyle: Record<string, string> = {
    "auth.login":      "bg-emerald-500/10 text-emerald-600",
    "auth.2fa_toggle": "bg-violet-500/10 text-violet-600",
    "auth.logout":     "bg-red-500/10 text-red-600",
};

type Props = {
    activities: ActivityLogProps[];
};

export function RecentActivity({ activities }: Props) {
    return (
        <div className="rounded-2xl border border-base-300 bg-base-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-base-300">
                <div className="flex items-center gap-2">
                    <Activity size={16} className="text-primary" />
                    <h2 className="font-semibold text-sm">Recent Activity</h2>
                </div>
                <span className="badge badge-ghost badge-sm">{activities.length}</span>
            </div>

            {/* List */}
            <ul className="divide-y divide-base-200">
                {activities.map((activity: any) => (
                    <li key={activity.id} className="hover:bg-base-200/40 transition-colors">
                        <Link
                            to={`/accounts/${activity.user.id}?tab=activity-logs`}
                            className="flex items-start gap-3 px-5 py-3.5"
                        >
                            <div className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${eventStyle[activity.event] ?? "bg-base-200 text-base-content"}`}>
                                {activity.user.first_name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-base-content leading-snug">
                                    <span className="font-semibold">
                                        {activity.user.first_name} {activity.user.last_name}
                                    </span>
                                    {" "}{activity.description}
                                </p>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    <span className="flex items-center gap-1 text-[10px] text-base-content/35 font-mono">
                                        <Clock size={9} />{activity.time}
                                    </span>
                                    <span className="flex items-center gap-1 text-[10px] text-base-content/35 font-mono">
                                        <MapPin size={9} />{activity.ip}
                                    </span>
                                </div>
                                <span className={`mt-1.5 inline-block text-[10px] px-1.5 py-0.5 rounded font-mono ${eventStyle[activity.event] ?? "bg-base-200 text-base-content/50"}`}>
                                    {activity.event}
                                </span>
                            </div>
                            <ArrowRight size={13} className="mt-1 shrink-0 text-base-content/30" />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}