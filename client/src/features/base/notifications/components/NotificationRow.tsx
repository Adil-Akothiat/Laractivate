import { typeConfig, iconMap, timeAgo } from "../utils/notification";
import type { NotificationProps } from "../types";

type Props = {
    notif: NotificationProps;
    onMarkRead: (id: string) => void;
    isMarking: boolean;
};

export function NotificationRow({ notif, onMarkRead, isMarking }: Props) {
    const isUnread = notif.read_at === null;
    const cfg = typeConfig[notif.data.type] ?? typeConfig.info;

    return (
        <div className={`flex items-start gap-4 px-6 py-4 hover:bg-base-200/40 transition-colors ${isUnread ? "bg-base-200/20" : ""}`}>
            {/* Unread dot */}
            <div className="flex items-center pt-1.5 shrink-0">
                <span className={`w-2 h-2 rounded-full ${isUnread ? cfg.dot : "opacity-0"}`} />
            </div>

            {/* Icon */}
            <span className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-base ${cfg.bg}`}>
                {iconMap[notif.data.icon] ?? "🔔"}
            </span>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <p className={`text-sm font-semibold ${isUnread ? "text-base-content" : "text-base-content/50"}`}>
                        {notif.data.title}
                    </p>
                    <span className="text-xs text-base-content/35 font-mono">
                        {timeAgo(notif.created_at)}
                    </span>
                </div>
                <p className="text-sm text-base-content/50 mt-0.5 leading-relaxed">
                    {notif.data.message}
                </p>
                <span className={`mt-1.5 inline-block badge badge-sm ${cfg.badge}`}>
                    {notif.data.type}
                </span>
            </div>

            {/* Action */}
            <div className="shrink-0 flex flex-col items-end gap-2">
                {notif.data.action && (
                    <a
                        href={notif.data.action}
                        className="text-sm text-primary font-semibold hover:underline"
                    >
                        View
                    </a>
                )}
                {isUnread && (
                    <button
                        className="text-[11px] text-base-content/40 hover:text-base-content transition-colors"
                        onClick={() => onMarkRead(notif.id)}
                        disabled={isMarking}
                    >
                        {isMarking
                            ? <span className="loading loading-spinner loading-xs" />
                            : "✓ Read"
                        }
                    </button>
                )}
            </div>
        </div>
    );
}