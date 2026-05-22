import { api } from "@/app/services/api";
import type { ApiResponseSchema } from "@/app/types";
import type { NotificationResponseSchema } from "../types";

const BASE_ROUTE = "/system/notifications";

export const notificationApi = {
  /**
   * Fetches the user's notification collection feed.
   */
  list: () => 
    api.get<ApiResponseSchema<NotificationResponseSchema>>(BASE_ROUTE).then((res) => res.data),

  /**
   * Marks a single notification item as read.
   */
  markAsRead: (id: string) => 
    api.patch<ApiResponseSchema<null>>(`${BASE_ROUTE}/${id}`).then((res) => res.data),

  /**
   * Marks all incoming notification streams as read.
   */
  markAllRead: () => 
    api.post<ApiResponseSchema<null>>(BASE_ROUTE).then((res) => res.data),
};