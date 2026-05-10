import { Bell } from "lucide-react";
import { Badge, Button, LoadingOverlay } from "../../../../components";
import { useGetNotifications, useMarkAllRead } from "../hooks/useNotification";
import type { NotificationProps } from "../types";
import { NotificationsList } from "./NotificationsList";
import NotificationDropDown from "./NotificationDropDown";

export default function NotificationBell() {
    const { data, isPending, refetch, isFetching } = useGetNotifications();
    const { mutate:markAllRead, isPending:isMarking } = useMarkAllRead();
    const notifications: NotificationProps[] = data?.data?.notifications ?? [];
    const unreadCount = data?.data?.unread_count ?? 0;

    const markAllReadHandler = ()=> {
        markAllRead();
    }

    if (isPending) return <LoadingOverlay />;
    const summary = (
        <>
            <Bell size={18} />
            {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-error text-error-content text-[10px] font-bold flex items-center justify-center ring-2 ring-base-100">
                    {unreadCount > 99 ? "99+" : unreadCount}
                </span>
            )}
        </>
    );

    const header = (
        <>
            <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Notifications</span>
                {unreadCount > 0 && (
                    <Badge size="xs" variant="primary">
                        {unreadCount} new
                    </Badge>
                )}
            </div>
            <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                    <Button
                        variant="ghost"
                        size="xs"
                        className="text-[11px]"
                        onClick={markAllReadHandler}
                        loading={isMarking}
                    >
                        Mark all read
                    </Button>
                )}
                <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => refetch()}
                    circle={true}
                    disabled={isFetching}
                >
                    <span className={isFetching?"animate-spin":""}>↻</span>
                </Button>
            </div>
        </>
    );

    return (
        <NotificationDropDown
            summary={summary}
            dropDownContent={{
                header,
                body: <NotificationsList notifications={notifications} />,
                footer: notifications.length > 0 ? true : undefined,
            }}
        />
    );
}