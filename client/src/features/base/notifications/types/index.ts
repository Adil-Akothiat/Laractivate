export interface NotificationData {
  title: string;
  message: string;
  action: string;
  type: "success" | "error" | "warning" | "info";
  icon: string;
}

export interface NotificationProps {
  id: string;
  data: NotificationData;
  read_at: string | null;
  created_at: string;
}


export type GroupedNotifications = {
  label: string;
  notifications: NotificationProps[];
};