import { Badge, LoadingOverlay } from "@/components";
import { typeConfig, iconMap, timeAgo } from "../utils/notification";
import type { NotificationSchema } from "../types";
import { useNotificationMutations } from "../hooks/useNotificationMutations";

type Props = {
  notification: NotificationSchema;
};

export function NotificationItem({ notification }: Props) {
  const isUnread = notification.readAt === null;
  const cfg = typeConfig[notification.details.type] ?? typeConfig.info;
  const { markAsRead } = useNotificationMutations();
  const markReadHandler = ()=> {
    if(isUnread) {
      markAsRead.mutate(
        notification?.id,
        {
          onSuccess:()=> {
            if(notification.details.action) {
              setTimeout(()=>{
                window.location.href = notification.details.action;
              }, 100)
            }
          }
        }
      );
    } else {
      window.location.href = notification.details.action;
    }
  }

  return (
    <li
      className="w-full min-w-0 overflow-hidden"
      onClick={markReadHandler}
    >
      {markAsRead.isPending && <LoadingOverlay />}
      <div
        className={`cursor-pointer flex gap-3 items-start rounded-xl px-3 py-2.5 cursor-default hover:bg-base-200 transition-colors
        ${isUnread ? "bg-base-200/50" : "opacity-60"}`}
      >
        {/* Unread dot */}
        <span
          className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
            isUnread ? cfg.dot : "opacity-0"
          }`}
        />

        {/* Icon */}
        <span
          className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm ${cfg.bg}`}
        >
          {iconMap[notification.details.icon] ?? "🔔"}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0 overflow-hidden"> {/* ✅ Fix 2: overflow-hidden alongside min-w-0 */}
          <p
            className={`text-xs font-semibold leading-tight truncate ${
              isUnread ? "text-base-content" : "text-base-content/50"
            }`}
          >
            {notification.details.title}
          </p>

          <p className="text-xs text-base-content/50 mt-0.5 line-clamp-2 leading-relaxed break-words"> {/* ✅ Fix 3: break-words for long message text */}
            {notification.details.message}
          </p>

          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-[10px] text-base-content/35 font-mono">
              {timeAgo(notification.createdAt)}
            </span>
            <Badge
              variant={notification.details.type}
              size="xs"
            >
              {notification.details.type}
            </Badge>
          </div>
        </div>
      </div>
    </li>
  );
}