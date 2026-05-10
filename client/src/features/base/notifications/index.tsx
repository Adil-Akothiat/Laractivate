import { useGetNotifications, useMarkAllRead } from "./hooks/useNotification";
import { ScrollContainer } from "../../../components/ScrollContainer";
import { Bell, RefreshCw } from "lucide-react";
import type { NotificationProps } from "./types";
import { groupByDate } from "./utils/notification";
import { Button } from "../../../components";
import { NotificationItem } from "./components/NotificationItem";

export default function NotificationsPage() {
    const { data, isPending, refetch, isFetching } = useGetNotifications();
    const { mutate: markAllRead, isPending: isMarking } = useMarkAllRead();

    const notifications: NotificationProps[] = data?.data?.notifications ?? [];
    const unreadCount = data?.data?.unread_count ?? 0;
    const grouped = groupByDate(notifications);

    if (isPending) return (
        <div className="flex items-center justify-center h-64">
            <span className="loading loading-ring loading-lg text-primary" />
        </div>
    );

    return (
        <ScrollContainer>
            {/* ── Page Header ── */}
            <div className="flex items-start justify-between gap-4 px-1 py-2">
                <div>
                    <h1 className="text-2xl font-bold text-base-content">Notifications</h1>
                    {unreadCount > 0 ? (
                        <p className="text-sm text-base-content/50 mt-1">
                            You have{" "}
                            <span className="text-primary font-semibold">{unreadCount}</span>
                            {" "}notification{unreadCount !== 1 ? "s" : ""} to go through
                        </p>
                    ) : (
                        <p className="text-sm text-base-content/50 mt-1">
                            You're all caught up 🎉
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        circle={true}
                        variant="ghost"
                        disabled={isFetching}
                        onClick={()=> refetch()}
                        title="Refresh"
                    >
                        <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
                    </Button>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="xs"
                            onClick={()=> markAllRead()}
                            loading={isMarking}
                        >
                            Mark all as Read
                        </Button>
                    )}
                </div>
            </div>

            {/* ── Empty State ── */}
            {notifications.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 gap-3 text-base-content/30">
                    <Bell size={40} strokeWidth={1.5} />
                    <p className="text-sm font-medium">No notifications yet</p>
                </div>
            )}
            {/* ── Grouped List ── */}
            {grouped.map((group) => (
                <div key={group.label} className="space-y-1">
                    {/* Group label */}
                    <p className="text-xs font-semibold text-base-content/40 uppercase tracking-widest px-1 pb-1">
                        {group.label}
                    </p>
                    {/* Group items */}
                    <div className="rounded-2xl border border-base-300 bg-base-100 overflow-hidden divide-y divide-base-200">
                        {group.notifications.map((notif:NotificationProps) => (
                            <NotificationItem
                                key={notif.id}
                                notif={notif}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </ScrollContainer>
    );
}