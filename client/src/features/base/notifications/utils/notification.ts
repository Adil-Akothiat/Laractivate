import type { GroupedNotifications, NotificationProps, NotificationData } from "../types"

export const typeConfig: Record<
  NotificationData["type"],
  { badge: string; dot: string; bg: string }
> = {
  success: { badge: "badge-success", dot: "bg-success", bg: "bg-success/10" },
  error:   { badge: "badge-error",   dot: "bg-error",   bg: "bg-error/10" },
  warning: { badge: "badge-warning", dot: "bg-warning", bg: "bg-warning/10" },
  info:    { badge: "badge-info",    dot: "bg-info",    bg: "bg-info/10" },
};

export const iconMap: Record<string, string> = {
  "user-plus": "👤",
  bell: "🔔",
  check: "✅",
  alert: "⚠️",
  info: "ℹ️",
  mail: "✉️",
};

export function timeAgo(dateStr: string): string {
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function groupByDate(notifications: NotificationProps[]): GroupedNotifications[] {
  const groups: Record<string, NotificationProps[]> = {};

  notifications.forEach((n:NotificationProps) => {
    const date = new Date(n.created_at);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const label = isToday
      ? "Today"
      : isYesterday
      ? "Yesterday"
      : date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    if (!groups[label]) groups[label] = [];
    groups[label].push(n);
  });

  return Object.entries(groups).map(([label, notifications]) => ({ label, notifications }));
}