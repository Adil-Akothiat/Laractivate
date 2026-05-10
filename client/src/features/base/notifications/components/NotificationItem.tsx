import { Badge, LoadingOverlay } from "../../../../components";
import { useMarkAsRead } from "../hooks/useNotification";
import type { NotificationProps } from "../types/index";
import { typeConfig, iconMap, timeAgo } from "../utils/notification";

type Props = {
  notif: NotificationProps;
};

export function NotificationItem({ notif }: Props) {
  const isUnread = notif.read_at === null;
  const cfg = typeConfig[notif.data.type] ?? typeConfig.info;
  const { mutate:markAsRead, isPending } = useMarkAsRead();
  const markReadHandler = ()=> {
    if(isUnread) {
      markAsRead(
        notif?.id,
        {
          onSuccess:()=> {
            if(notif.data.action) {
              setTimeout(()=>{
                window.location.href = notif.data.action;
              }, 100)
            }
          }
        }
      );
    } else {
      window.location.href = notif.data.action;
    }
  }

  return (
    <li
      className="w-full min-w-0 overflow-hidden"
      onClick={markReadHandler}
    >
      {isPending && <LoadingOverlay />}
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
          {iconMap[notif.data.icon] ?? "🔔"}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0 overflow-hidden"> {/* ✅ Fix 2: overflow-hidden alongside min-w-0 */}
          <p
            className={`text-xs font-semibold leading-tight truncate ${
              isUnread ? "text-base-content" : "text-base-content/50"
            }`}
          >
            {notif.data.title}
          </p>

          <p className="text-xs text-base-content/50 mt-0.5 line-clamp-2 leading-relaxed break-words"> {/* ✅ Fix 3: break-words for long message text */}
            {notif.data.message}
          </p>

          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-[10px] text-base-content/35 font-mono">
              {timeAgo(notif.created_at)}
            </span>
            <Badge
              variant={notif.data.type}
              size="xs"
            >
              {notif.data.type}
            </Badge>
          </div>
        </div>
      </div>
    </li>
  );
}