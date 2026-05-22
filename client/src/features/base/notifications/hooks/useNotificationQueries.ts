import { useQuery } from "@tanstack/react-query";
import { notificationKeys } from "./keys";
import { notificationApi } from "../api";

export const useNotifications = () =>
  useQuery({
    queryKey: notificationKeys.lists(),
    queryFn: () => notificationApi.list(),
    refetchInterval: 30_000, // Polls every 30 seconds
    select: res=> res.data
  });