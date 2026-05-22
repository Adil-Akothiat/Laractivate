import type { NotificationSchema } from "../types";
import { typeConfig, iconMap, timeAgo } from "../utils/notification";

type Props = {
    notification: NotificationSchema;
    onMarkRead: (id: string) => void;
    isMarking: boolean;
};

export function NotificationRow({ notification, onMarkRead, isMarking }: Props) {
    const isUnread = notification.readAt === null;
    const cfg = typeConfig[notification.details.type] ?? typeConfig.info;

    return (
        <div className={`flex items-start gap-4 px-6 py-4 hover:bg-base-200/40 transition-colors ${isUnread ? "bg-base-200/20" : ""}`}>
            {/* Unread dot */}
            <div className="flex items-center pt-1.5 shrink-0">
                <span className={`w-2 h-2 rounded-full ${isUnread ? cfg.dot : "opacity-0"}`} />
            </div>

            {/* Icon */}
            <span className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-base ${cfg.bg}`}>
                {iconMap[notification.details.icon] ?? "🔔"}
            </span>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <p className={`text-sm font-semibold ${isUnread ? "text-base-content" : "text-base-content/50"}`}>
                        {notification.details.title}
                    </p>
                    <span className="text-xs text-base-content/35 font-mono">
                        {timeAgo(notification.createdAt)}
                    </span>
                </div>
                <p className="text-sm text-base-content/50 mt-0.5 leading-relaxed">
                    {notification.details.message}
                </p>
                <span className={`mt-1.5 inline-block badge badge-sm ${cfg.badge}`}>
                    {notification.details.type}
                </span>
            </div>

            {/* Action */}
            <div className="shrink-0 flex flex-col items-end gap-2">
                {notification.details.action && (
                    <a
                        href={notification.details.action}
                        className="text-sm text-primary font-semibold hover:underline"
                    >
                        View
                    </a>
                )}
                {isUnread && (
                    <button
                        className="text-[11px] text-base-content/40 hover:text-base-content transition-colors"
                        onClick={() => onMarkRead(notification.id)}
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