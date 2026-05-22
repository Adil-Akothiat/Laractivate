export interface NotificationDetailSchema {
  title: string;
  message: string;
  action: string;
  type: "success" | "error" | "warning" | "info";
  icon: string;
}

export interface NotificationSchema {
  id: string;
  details: NotificationDetailSchema;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationResponseSchema {
  unreadCount:number;
  notifications: NotificationSchema[];
}

export interface GroupedNotificationsSchema {
  label: string;
  notifications: NotificationSchema[];
}