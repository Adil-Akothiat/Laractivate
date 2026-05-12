import { api } from "@/app/services/api";

const route = "/system/notifications";
export const fetchNotifications = () => api.get(route);

export const markAsRead = (id: string) =>
  api.patch(`${route}/${id}`);

export const markAllRead = () =>
  api.post(route);